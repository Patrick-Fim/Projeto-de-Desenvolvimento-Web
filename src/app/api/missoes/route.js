import { NextResponse } from 'next/server';

// Simulação de banco de dados em memória
let missoesMock = [
  {
    id: '1',
    title: 'Reflorestamento das Margens do Rio',
    description: 'Plantio de mudas nativas para conter a erosão e restaurar a mata ciliar da região central.',
    ring: 'terra',
    location: 'Porto Alegre, RS',
    status: 'Ativa',
    participants: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Mutirão de Limpeza da Praia',
    description: 'Recolhimento de resíduos plásticos e conscientização de banhistas sobre o descarte correto.',
    ring: 'agua',
    location: 'Florianópolis, SC',
    status: 'Ativa',
    participants: 128,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Combate a Focos de Incêndio Urbano',
    description: 'Monitoramento comunitário e denúncia de queimadas irregulares em terrenos baldios.',
    ring: 'fogo',
    location: 'Curitiba, PR',
    status: 'Urgente',
    participants: 15,
    createdAt: new Date().toISOString(),
  },
];

// 1. GET - Listar todas as missões/denúncias
export async function GET() {
  try {
    return NextResponse.json(missoesMock, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar missões ambientais.', error: error.message },
      { status: 500 }
    );
  }
}

// 2. POST - Criar uma nova denúncia/missão (via Formulário)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, ring, location, reporterName, reporterEmail } = body;

    // Validação mínima no servidor
    if (!title || !description || !ring || !location || !reporterName || !reporterEmail) {
      return NextResponse.json(
        { message: 'Todos os campos obrigatórios devem ser preenchidos.' },
        { status: 400 }
      );
    }

    const novaMissao = {
      id: String(Date.now()),
      title,
      description,
      ring,
      location,
      reporterName,
      reporterEmail,
      status: 'Análise',
      participants: 1,
      createdAt: new Date().toISOString(),
    };

    missoesMock.unshift(novaMissao);

    return NextResponse.json(novaMissao, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Falha ao registrar denúncia.', error: error.message },
      { status: 500 }
    );
  }
}

// 3. DELETE - Remover uma denúncia/missão por ID
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'O ID da missão é obrigatório para exclusão.' },
        { status: 400 }
      );
    }

    const index = missoesMock.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json(
        { message: 'Missão ambiental não encontrada.' },
        { status: 404 }
      );
    }

    const missaoRemovida = missoesMock.splice(index, 1)[0];

    return NextResponse.json(
      { message: 'Missão removida com sucesso.', missao: missaoRemovida },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao excluir missão.', error: error.message },
      { status: 500 }
    );
  }
}