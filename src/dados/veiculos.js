// Os `id` abaixo são load-bearing, não rótulos internos:
//   - são as chaves de PERCENTUAL_POR_TIPO em dados/calculo.js
//   - viajam na URL como ?tipo= em /beneficios e /cotacao
// Renomear um quebra o cálculo da cotação e invalida links já compartilhados.
// Adicionar um veículo exige adicionar o percentual correspondente em calculo.js.
export const veiculos = [
  {
    id: 'carros',
    nome: 'Carros',
    chamada: 'Proteção completa para o seu automóvel.',
    descricao:
      'Cobertura pensada para o uso diário do carro de passeio, do trajeto para o trabalho às viagens em família. A adesão é simples e a proteção acompanha o veículo em todo o território nacional.',
    foto: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
    coberturas: [
      'Roubo e furto', 'Colisão e perda total', 'Incêndio', 'Fenômenos naturais',
      'Carro reserva', 'Rastreador', 'Assistência 24h', 'Vidros e retrovisores',
    ],
  },
  {
    id: 'motos',
    nome: 'Motos',
    chamada: 'Sua moto protegida em qualquer estrada.',
    descricao:
      'Motocicletas exigem cobertura própria, com atenção a roubo, furto e acidentes de trajeto. O plano inclui assistência especializada e guincho compatível com o porte da moto.',
    foto: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
    coberturas: [
      'Roubo e furto', 'Colisão e perda total', 'Incêndio', 'Fenômenos naturais',
      'Rastreador', 'Assistência 24h', 'Guincho especializado',
    ],
  },
  {
    id: 'caminhoes-34',
    nome: 'Caminhões 3/4',
    chamada: 'Cobertura sob medida para o transporte leve.',
    descricao:
      'Para quem depende do caminhão 3/4 na rotina de entregas e transporte leve, a proteção reduz o impacto de imprevistos na estrada. Assistência 24 horas e guincho pesado mantêm a operação em movimento.',
    foto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80',
    coberturas: [
      'Roubo e furto', 'Colisão e perda total', 'Incêndio', 'Rastreador',
      'Assistência 24h', 'Guincho pesado',
    ],
  },
  {
    id: 'caminhoes-pesados',
    nome: 'Caminhões Pesados',
    chamada: 'Seu patrimônio de trabalho sob guarda.',
    descricao:
      'Caminhões pesados representam um investimento significativo e a base do trabalho de muitos associados. A cobertura abrange o cavalo e a carreta, com guincho pesado e assistência voltada à realidade do transporte de carga.',
    foto: 'https://images.unsplash.com/photo-1586191582151-f73872dfd183?w=1200&q=80',
    coberturas: [
      'Roubo e furto', 'Colisão e perda total', 'Incêndio', 'Rastreador',
      'Assistência 24h', 'Guincho pesado', 'Cobertura de carreta',
    ],
  },
]
