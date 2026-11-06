'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  FaRightToBracket,
  FaUserPlus,
  FaTriangleExclamation,
  FaCircleCheck,
  FaFire,
  FaTrophy,
  FaStar,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa6';
import { auth } from '../../lib/firebaseAuth';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import AsciiGlobe from '../../components/AsciiGlobe';

// Traduz os códigos de erro do Firebase Auth para mensagens amigáveis.
const ERROS_FIREBASE = {
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente entrar.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/invalid-email': 'Insira um e-mail válido.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
  'auth/operation-not-allowed': 'O login por e-mail ainda não foi ativado no Firebase.',
  'auth/configuration-not-found': 'O Authentication ainda não foi ativado no projeto Firebase.',
};

// Mensagem amigável; para erros desconhecidos, mostra o código para facilitar o suporte.
const mensagemDeErro = (err) =>
  ERROS_FIREBASE[err?.code] || `Não foi possível concluir. Tente novamente.${err?.code ? ` (${err.code})` : ''}`;

const VANTAGENS = [
  { Icon: FaStar, texto: 'Ganhe XP e suba de nível a cada missão' },
  { Icon: FaFire, texto: 'Mantenha seu foguinho aceso todos os dias' },
  { Icon: FaTrophy, texto: 'Dispute o ranking dos protetores' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Só aceita voltar para páginas internas (evita redirecionar para outro site).
function destinoSeguro() {
  const voltar = new URLSearchParams(window.location.search).get('voltar');
  return voltar && voltar.startsWith('/') && !voltar.startsWith('//') ? voltar : '/perfil';
}

function MensagemErro({ nome, erro }) {
  if (!erro) return null;
  return (
    <p id={`${nome}-erro`} className="flex items-center gap-1.5 text-xs font-semibold text-danger-text animate-fadeIn">
      <FaTriangleExclamation aria-hidden="true" />
      {erro}
    </p>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { usuario, carregando, definirNomePendente } = useAuth();

  const [modo, setModo] = useState('entrar');
  const [campos, setCampos] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Quem já está logado vai direto para o destino.
  useEffect(() => {
    if (!carregando && usuario) router.replace(destinoSeguro());
  }, [carregando, usuario, router]);

  const cadastro = modo === 'cadastrar';

  const trocarModo = (novoModo) => {
    setModo(novoModo);
    setErros({});
    setErroGeral('');
    setAviso('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((anterior) => ({ ...anterior, [name]: value }));
    if (erros[name]) setErros((anterior) => ({ ...anterior, [name]: '' }));
  };

  const validar = () => {
    const novos = {};
    if (cadastro) {
      const nome = campos.nome.trim();
      if (!nome) novos.nome = 'Informe seu nome.';
      else if (nome.length < 3) novos.nome = 'O nome deve ter no mínimo 3 caracteres.';
    }
    if (!campos.email.trim()) novos.email = 'Informe seu e-mail.';
    else if (!EMAIL_REGEX.test(campos.email.trim())) novos.email = 'Insira um e-mail válido (ex: nome@dominio.com).';
    if (!campos.senha) novos.senha = 'Informe sua senha.';
    else if (cadastro && campos.senha.length < 6) novos.senha = 'A senha precisa ter pelo menos 6 caracteres.';
    if (cadastro && campos.confirmarSenha !== campos.senha) novos.confirmarSenha = 'As senhas não coincidem.';
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroGeral('');
    setAviso('');
    if (!validar()) return;

    try {
      setEnviando(true);
      const email = campos.email.trim();
      if (cadastro) {
        const nome = campos.nome.trim();
        // O nome é usado pelo AuthProvider ao criar o perfil no primeiro acesso.
        definirNomePendente(nome);
        const credencial = await createUserWithEmailAndPassword(auth, email, campos.senha);
        await updateProfile(credencial.user, { displayName: nome });
        // Conta nova: leva direto para a personalização do perfil.
        router.replace('/perfil?novo=1');
        return;
      }
      await signInWithEmailAndPassword(auth, email, campos.senha);
      router.replace(destinoSeguro());
    } catch (err) {
      definirNomePendente('');
      setErroGeral(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  };

  const recuperarSenha = async () => {
    setErroGeral('');
    setAviso('');
    const email = campos.email.trim();
    if (!EMAIL_REGEX.test(email)) {
      setErros((anterior) => ({ ...anterior, email: 'Digite seu e-mail acima para recuperar a senha.' }));
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAviso('Se este e-mail estiver cadastrado, você receberá um link para criar uma nova senha.');
    } catch (err) {
      setErroGeral(mensagemDeErro(err));
    }
  };

  const classeCampo = (nome) =>
    `w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted/70 transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
      erros[nome] ? 'border-danger-text focus:border-danger-text' : 'border-border focus:border-primary'
    }`;

  const a11y = (nome) => ({
    'aria-invalid': erros[nome] ? true : undefined,
    'aria-describedby': erros[nome] ? `${nome}-erro` : undefined,
  });

  return (
    <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:py-16 lg:grid-cols-2">
      {/* Painel da marca */}
      <section className="relative isolate hidden overflow-hidden rounded-3xl bg-linear-to-br from-[#03045E] via-[#023E8A] to-[#14532D] p-10 text-white shadow-2xl lg:block">
        <div aria-hidden="true" className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[#00B4D8]/25 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#90E0EF]">Protetores da Terra</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">O Poder é de Vocês.</h1>
        <p className="mt-3 max-w-sm text-white/80">
          Entre para registrar denúncias, engajar em missões e acompanhar seu impacto pelo planeta.
        </p>

        <div className="mx-auto my-6 aspect-square w-full max-w-[300px]" aria-hidden="true">
          <AsciiGlobe />
        </div>

        <ul className="space-y-3">
          {VANTAGENS.map(({ Icon, texto }) => (
            <li key={texto} className="flex items-center gap-3 text-sm font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#90E0EF]">
                <Icon aria-hidden="true" />
              </span>
              {texto}
            </li>
          ))}
        </ul>
      </section>

      {/* Formulário */}
      <section className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-black tracking-tight text-foreground lg:hidden">Protetores da Terra</h1>
        <h2 className="mt-2 text-2xl font-black text-foreground lg:mt-0">
          {cadastro ? 'Crie sua conta de protetor' : 'Bem-vindo de volta'}
        </h2>
        <p className="mt-2 text-sm text-foreground-muted">
          {cadastro ? 'Leva menos de um minuto e você já começa ganhando XP.' : 'Entre para continuar sua jornada.'}
        </p>

        {/* Alternância entre entrar e criar conta */}
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1" role="group" aria-label="Tipo de acesso">
          {[
            { id: 'entrar', label: 'Entrar', Icon: FaRightToBracket },
            { id: 'cadastrar', label: 'Criar conta', Icon: FaUserPlus },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => trocarModo(id)}
              aria-pressed={modo === id}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${
                modo === id
                  ? 'bg-primary-dark text-white shadow-sm dark:text-slate-950'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {erroGeral && (
          <div role="alert" className="mt-5 flex items-center gap-2 rounded-xl border border-danger-text/30 bg-danger-text/10 p-4 text-sm font-semibold text-danger-text">
            <FaTriangleExclamation aria-hidden="true" />
            {erroGeral}
          </div>
        )}
        {aviso && (
          <div role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm font-semibold text-accent-text">
            <FaCircleCheck aria-hidden="true" />
            {aviso}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          {cadastro && (
            <div className="space-y-1.5">
              <label htmlFor="nome" className="text-sm font-bold text-foreground">Nome</label>
              <input id="nome" name="nome" type="text" autoComplete="name" value={campos.nome} onChange={handleChange} placeholder="Ex: Ana Silva" className={classeCampo('nome')} {...a11y('nome')} />
              <MensagemErro nome="nome" erro={erros.nome} />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-bold text-foreground">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" value={campos.email} onChange={handleChange} placeholder="protetor@terra.org" className={classeCampo('email')} {...a11y('email')} />
            <MensagemErro nome="email" erro={erros.email} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="senha" className="text-sm font-bold text-foreground">Senha</label>
              {!cadastro && (
                <button type="button" onClick={recuperarSenha} className="cursor-pointer text-xs font-semibold text-primary-text hover:underline">
                  Esqueci minha senha
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="senha"
                name="senha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete={cadastro ? 'new-password' : 'current-password'}
                value={campos.senha}
                onChange={handleChange}
                placeholder={cadastro ? 'Mínimo de 6 caracteres' : 'Sua senha'}
                className={`${classeCampo('senha')} pr-11`}
                {...a11y('senha')}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-foreground-muted hover:bg-foreground/5 hover:text-foreground"
              >
                {mostrarSenha ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
              </button>
            </div>
            <MensagemErro nome="senha" erro={erros.senha} />
          </div>

          {cadastro && (
            <div className="space-y-1.5">
              <label htmlFor="confirmarSenha" className="text-sm font-bold text-foreground">Confirmar senha</label>
              <input id="confirmarSenha" name="confirmarSenha" type={mostrarSenha ? 'text' : 'password'} autoComplete="new-password" value={campos.confirmarSenha} onChange={handleChange} placeholder="Repita a senha" className={classeCampo('confirmarSenha')} {...a11y('confirmarSenha')} />
              <MensagemErro nome="confirmarSenha" erro={erros.confirmarSenha} />
            </div>
          )}

          <Button type="submit" size="lg" disabled={enviando} className="w-full">
            {cadastro ? <FaUserPlus aria-hidden="true" /> : <FaRightToBracket aria-hidden="true" />}
            {enviando ? 'Aguarde...' : cadastro ? 'Criar conta' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          {cadastro ? 'Já tem uma conta?' : 'Ainda não é um protetor?'}{' '}
          <button
            type="button"
            onClick={() => trocarModo(cadastro ? 'entrar' : 'cadastrar')}
            className="cursor-pointer font-bold text-primary-text hover:underline"
          >
            {cadastro ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
      </section>
    </main>
  );
}
