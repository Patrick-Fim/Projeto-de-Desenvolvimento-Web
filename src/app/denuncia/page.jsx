'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { XP } from '../../lib/gamificacao';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import { RINGS, getRing } from '../../lib/rings';
import {
  FaBullhorn,
  FaCircleCheck,
  FaTriangleExclamation,
  FaShieldHeart,
  FaArrowRight,
  FaPaperPlane,
  FaRightToBracket,
  FaStar,
} from 'react-icons/fa6';

const ESTADO_INICIAL = {
  reporterName: '',
  reporterEmail: '',
  title: '',
  ring: 'terra',
  location: '',
  description: '',
};

const PASSOS = [
  'Preencha seus dados de contato.',
  'Descreva a ocorrência e o anel relacionado.',
  'A denúncia entra no Painel de Missões.',
];

// Estilo base dos campos; muda a borda quando há erro.
const inputClass = (hasError) =>
  `w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted/70 transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
    hasError ? 'border-danger-text focus:border-danger-text' : 'border-border focus:border-primary'
  }`;

// Agrupa rótulo, campo e mensagem de erro com os atributos de acessibilidade.
function Campo({ id, label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-bold text-foreground">
        {label}
        <span className="text-danger-text" aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} className="flex items-center gap-1.5 text-xs font-semibold text-danger-text animate-fadeIn">
          <FaTriangleExclamation aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function DenunciaPage() {
  const { usuario, perfil, carregando, chamarApi, setPerfil } = useAuth();

  // Valores controlados dos campos do formulário.
  const [formData, setFormData] = useState(ESTADO_INICIAL);

  // Preenche nome e e-mail com os dados de quem está logado.
  useEffect(() => {
    if (!perfil) return;
    setFormData((anterior) => ({
      ...anterior,
      reporterName: anterior.reporterName || perfil.nome || '',
      reporterEmail: anterior.reporterEmail || perfil.email || '',
    }));
  }, [perfil]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  // Validação campo por campo (disparada no Blur ou no Submit)
  const validateField = (name, value) => {
    let error = '';
    const val = value ? value.trim() : '';

    if (name === 'reporterName') {
      if (!val) error = 'Informe seu nome completo.';
      else if (val.length < 3) error = 'O nome deve ter no mínimo 3 caracteres.';
      else if (!val.includes(' ')) error = 'Por favor, informe seu nome e sobrenome.';
    }

    if (name === 'reporterEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!val) error = 'Informe seu e-mail de contato.';
      else if (!emailRegex.test(val)) error = 'Insira um e-mail válido (ex: nome@dominio.com).';
    }

    if (name === 'title') {
      if (!val) error = 'Digite um título para a denúncia.';
      else if (val.length < 5) error = 'O título deve ter no mínimo 5 caracteres.';
    }

    if (name === 'location') {
      if (!val) error = 'Informe a Cidade e UF do ocorrido.';
      else if (val.length < 3) error = 'Informe Cidade e Estado válidos (ex: Ijuí, RS).';
    }

    if (name === 'description') {
      if (!val) error = 'Descreva os detalhes da denúncia.';
      else if (val.length < 15) error = 'A descrição deve ter pelo menos 15 caracteres.';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Atualiza a mensagem de erro enquanto o usuário corrige um campo já validado.
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateForm = () => {
    // Verifica todos os campos antes de permitir o envio.
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      // Envia os dados validados para a API de missões (com o token de login).
      const resposta = await chamarApi('/api/missoes', { method: 'POST', body: formData });
      setPerfil(resposta.perfil);

      setSuccessMessage(
        `Sua denúncia foi registrada com sucesso e enviada para o painel de missões! +${resposta.xpGanho} XP`
      );
      setFormData({
        ...ESTADO_INICIAL,
        reporterName: perfil?.nome || '',
        reporterEmail: perfil?.email || '',
      });
      setErrors({});
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Atributos comuns de acessibilidade para cada campo.
  const a11y = (name) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-erro` : undefined,
  });

  // Registrar denúncia exige login: assim a missão fica ligada ao seu criador.
  if (carregando || !usuario) {
    return (
      <main>
        <PageHeader
          eyebrow={<><FaBullhorn aria-hidden="true" /> Formulário Oficial</>}
          title="Registrar Ocorrência Ambiental"
          description="Preencha os campos abaixo para catalogar um crime ou demanda ecológica na sua região. A denúncia passará a integrar o Painel de Missões."
        />
        <div className="mx-auto max-w-6xl px-6 py-10">
          {carregando ? (
            <div className="h-64 animate-pulse rounded-2xl bg-foreground/10" aria-busy="true">
              <span className="sr-only">Carregando...</span>
            </div>
          ) : (
            <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary-text">
                <FaRightToBracket aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-foreground">Entre para registrar uma denúncia</h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Assim a ocorrência fica ligada ao seu perfil e você ganha{' '}
                <strong className="text-accent-text">+{XP.criarMissao} XP</strong> por cada denúncia.
              </p>
              <Link
                href="/login?voltar=/denuncia"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark px-6 py-3 font-bold text-white hover:brightness-110 dark:text-slate-950"
              >
                <FaRightToBracket aria-hidden="true" />
                Entrar ou criar conta
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        eyebrow={<><FaBullhorn aria-hidden="true" /> Formulário Oficial</>}
        title="Registrar Ocorrência Ambiental"
        description="Preencha os campos abaixo para catalogar um crime ou demanda ecológica na sua região. A denúncia passará a integrar o Painel de Missões."
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Alertas */}
          {successMessage && (
            <div role="status" className="flex gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-5 animate-fadeIn">
              <FaCircleCheck aria-hidden="true" className="mt-0.5 shrink-0 text-xl text-accent-text" />
              <div className="space-y-1">
                <p className="font-bold text-accent-text">{successMessage}</p>
                <Link href="/missoes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 hover:underline">
                  Ir para o Painel de Missões
                  <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {apiError && (
            <div role="alert" className="flex items-center gap-3 rounded-2xl border border-danger-text/30 bg-danger-text/10 p-5 text-sm font-semibold text-danger-text">
              <FaTriangleExclamation aria-hidden="true" />
              {apiError}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} noValidate className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            {/* Seção 1: dados do protetor */}
            <section className="space-y-5">
              <h2 className="text-lg font-bold text-foreground">Seus dados</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Campo id="reporterName" label="Nome do Protetor" error={errors.reporterName}>
                  <input
                    id="reporterName"
                    name="reporterName"
                    type="text"
                    autoComplete="name"
                    value={formData.reporterName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ex: Capitão Silva"
                    className={inputClass(errors.reporterName)}
                    {...a11y('reporterName')}
                  />
                </Campo>

                <Campo id="reporterEmail" label="E-mail de Contato" error={errors.reporterEmail}>
                  <input
                    id="reporterEmail"
                    name="reporterEmail"
                    type="email"
                    autoComplete="email"
                    value={formData.reporterEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="protetor@terra.org"
                    className={inputClass(errors.reporterEmail)}
                    {...a11y('reporterEmail')}
                  />
                </Campo>
              </div>
            </section>

            {/* Seção 2: a ocorrência */}
            <section className="space-y-5 border-t border-border pt-8">
              <h2 className="text-lg font-bold text-foreground">A ocorrência</h2>

              <Campo id="title" label="Título da Ocorrência" error={errors.title}>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ex: Descarte irregular de pneus em terreno baldio"
                  className={inputClass(errors.title)}
                  {...a11y('title')}
                />
              </Campo>

              {/* Seleção visual do Anel Elemental */}
              <fieldset>
                <legend className="text-sm font-bold text-foreground">Anel Elemental Relacionado</legend>
                <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                  {RINGS.map((ring) => {
                    const checked = formData.ring === ring.id;
                    const Icon = ring.Icon;
                    return (
                      <label
                        key={ring.id}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 px-2 py-3 text-center transition focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-card ${
                          checked ? `${ring.border} ${ring.soft}` : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ring"
                          value={ring.id}
                          checked={checked}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition ${
                            checked ? `${ring.bg} text-white dark:text-slate-950` : `${ring.soft} ${ring.text}`
                          }`}
                        >
                          <Icon aria-hidden="true" />
                        </span>
                        <span className="text-xs font-bold text-foreground">{ring.label}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-foreground-muted">{getRing(formData.ring).hint}</p>
              </fieldset>

              <Campo id="location" label="Cidade e Estado (UF)" error={errors.location}>
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ex: Ijuí, RS"
                  className={inputClass(errors.location)}
                  {...a11y('location')}
                />
              </Campo>

              <Campo id="description" label="Descrição Detalhada" error={errors.description}>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Descreva o local exato, pontos de referência e o que foi observado..."
                  className={`${inputClass(errors.description)} resize-y`}
                  {...a11y('description')}
                />
              </Campo>
            </section>

            {/* Botão de Envio */}
            <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
              <p className="text-xs text-foreground-muted">
                Campos marcados com <span className="font-bold text-danger-text">*</span> são obrigatórios.
              </p>
              <Button type="submit" variant="ecological" size="lg" disabled={submitting} className="w-full sm:w-auto">
                <FaPaperPlane aria-hidden="true" />
                {submitting ? 'Enviando Denúncia...' : 'Registrar Ocorrência'}
              </Button>
            </div>
          </form>
        </div>

        {/* Painel lateral de apoio */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold text-foreground">Como funciona</h2>
            <ol className="mt-4 space-y-4">
              {PASSOS.map((passo, i) => (
                <li key={passo} className="flex gap-3 text-sm text-foreground-muted">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary-text">
                    {i + 1}
                  </span>
                  <span className="pt-1">{passo}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm">
            <p className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <FaStar aria-hidden="true" />
              Ganhe +{XP.criarMissao} XP
            </p>
            <p className="mt-2 leading-relaxed text-foreground-muted">
              Cada denúncia registrada soma pontos no seu perfil e te leva para o topo do ranking.
            </p>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 text-sm">
            <p className="flex items-center gap-2 font-bold text-accent-text">
              <FaShieldHeart aria-hidden="true" />
              Seus dados estão protegidos
            </p>
            <p className="mt-2 leading-relaxed text-foreground-muted">
              Usamos seu e-mail apenas para retorno sobre a ocorrência registrada.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
