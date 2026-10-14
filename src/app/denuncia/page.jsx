'use client';

import { useState } from 'react';
import Button from '../../components/Button';

export default function DenunciaPage() {
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterEmail: '',
    title: '',
    ring: 'terra',
    location: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  // 1. Regra de validação campo por campo (disparada no Blur ou no Submit)
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

  // Manipulador ao digitar
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Se já existia um erro no campo, podemos ir revalidando enquanto digita
    if (errors[name]) {
      validateField(name, value);
    }
  };

  // Manipulador quando o usuário sai do campo (onBlur)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Validação geral antes do envio
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    return Object.keys(newErrors).length === 0;
  };

  // Envio via API REST (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/missoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Falha ao enviar denúncia para o servidor.');

      setSuccessMessage('🎉 Sua denúncia foi registrada com sucesso e enviada para o painel de missões!');
      
      // Reseta o formulário e erros
      setFormData({
        reporterName: '',
        reporterEmail: '',
        title: '',
        ring: 'terra',
        location: '',
        description: '',
      });
      setErrors({});
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8 min-h-[80vh]">
      {/* Cabeçalho */}
      <header className="space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-3 py-1 rounded-full">
          ✓ Formulário Oficial
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Registrar Ocorrência Ambiental
        </h1>
        <p className="text-foreground/70 text-sm md:text-base">
          Preencha os campos abaixo para catalogar um crime ou demanda ecológica na sua região. A denúncia passará a integrar o Painel de Missões.
        </p>
      </header>

      {/* Alertas de Sucesso ou Erro Geral */}
      {successMessage && (
        <div className="bg-accent text-white p-4 rounded-xl shadow-md space-y-2 animate-fadeIn">
          <p className="font-bold">{successMessage}</p>
          <a href="/missoes" className="underline text-xs block hover:opacity-90 font-semibold">
            ➜ Ir para o Painel de Missões para visualizar
          </a>
        </div>
      )}

      {apiError && (
        <div className="bg-ring-fire/10 border border-ring-fire text-ring-fire p-4 rounded-xl text-sm">
          ❌ {apiError}
        </div>
      )}

      {/* Formulário com validação instantânea noBlur */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6" noValidate>
        
        {/* Campo 1: Nome */}
        <div className="space-y-1.5">
          <label htmlFor="reporterName" className="block text-sm font-bold text-foreground">
            1. Nome do Protetor <span className="text-ring-fire">*</span>
          </label>
          <input
            id="reporterName"
            name="reporterName"
            type="text"
            value={formData.reporterName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex: Capitão Silva"
            className={`w-full bg-background border ${errors.reporterName ? 'border-ring-fire' : 'border-border'} rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
          />
          {errors.reporterName && <p className="text-xs text-ring-fire font-medium animate-fadeIn">{errors.reporterName}</p>}
        </div>

        {/* Campo 2: E-mail */}
        <div className="space-y-1.5">
          <label htmlFor="reporterEmail" className="block text-sm font-bold text-foreground">
            2. E-mail de Contato <span className="text-ring-fire">*</span>
          </label>
          <input
            id="reporterEmail"
            name="reporterEmail"
            type="email"
            value={formData.reporterEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="protetor@terra.org"
            className={`w-full bg-background border ${errors.reporterEmail ? 'border-ring-fire' : 'border-border'} rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
          />
          {errors.reporterEmail && <p className="text-xs text-ring-fire font-medium animate-fadeIn">{errors.reporterEmail}</p>}
        </div>

        {/* Campo 3: Título */}
        <div className="space-y-1.5">
          <label htmlFor="title" className="block text-sm font-bold text-foreground">
            3. Título da Ocorrência <span className="text-ring-fire">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex: Descarte irregular de pneus em terreno baldio"
            className={`w-full bg-background border ${errors.title ? 'border-ring-fire' : 'border-border'} rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
          />
          {errors.title && <p className="text-xs text-ring-fire font-medium animate-fadeIn">{errors.title}</p>}
        </div>

        {/* Campo 4: Select do Anel Elemental */}
        <div className="space-y-1.5">
          <label htmlFor="ring" className="block text-sm font-bold text-foreground">
            4. Anel Elemental Relacionado
          </label>
          <select
            id="ring"
            name="ring"
            value={formData.ring}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="terra">🌿 Terra — Desmatamento e vegetação</option>
            <option value="fogo">🔥 Fogo — Queimadas e focos de incêndio</option>
            <option value="vento">💨 Vento — Poluição do ar e odores industriais</option>
            <option value="agua">💧 Água — Poluição hídrica e esgoto em rios</option>
            <option value="coracao">❤️ Coração — Mobilização e maus-tratos animais</option>
          </select>
        </div>

        {/* Campo 5: Cidade / UF */}
        <div className="space-y-1.5">
          <label htmlFor="location" className="block text-sm font-bold text-foreground">
            5. Cidade e Estado (UF) <span className="text-ring-fire">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex: Ijuí, RS"
            className={`w-full bg-background border ${errors.location ? 'border-ring-fire' : 'border-border'} rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
          />
          {errors.location && <p className="text-xs text-ring-fire font-medium animate-fadeIn">{errors.location}</p>}
        </div>

        {/* Campo 6: Descrição */}
        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-bold text-foreground">
            6. Descrição Detalhada <span className="text-ring-fire">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Descreva o local exato, pontos de referência e o que foi observado..."
            className={`w-full bg-background border ${errors.description ? 'border-ring-fire' : 'border-border'} rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
          ></textarea>
          {errors.description && <p className="text-xs text-ring-fire font-medium animate-fadeIn">{errors.description}</p>}
        </div>

        {/* Botão de Envio */}
        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            type="submit"
            variant="ecological"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? 'Enviando Denúncia...' : 'Registrar Ocorrência'}
          </Button>
        </div>
      </form>
    </main>
  );
}