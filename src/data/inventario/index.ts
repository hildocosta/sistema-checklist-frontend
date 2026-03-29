import { ARMAS } from './armamentos';
import { MUNICOES } from './municoes';
import { EQUIPAMENTOS } from './equipamentos';
import { COMUNICACAO } from './comunicacao';
import { VEICULOS } from './veiculos';
import { SADE } from './sade';
import { ACESSORIOSADE } from './acessoriosade';
import { TASER } from './taser';
import { EFETIVO_17BPM } from './efetivo'; 

// Exportando para que a página possa encontrar
export { 
  ARMAS, 
  MUNICOES, 
  EQUIPAMENTOS, 
  COMUNICACAO, 
  VEICULOS, 
  SADE, 
  ACESSORIOSADE, 
  TASER,
  EFETIVO_17BPM 
};

// Exportação da lista unificada para o Estado Inicial
export const INVENTARIO_COMPLETO = [
  ...ARMAS,
  ...MUNICOES,
  ...EQUIPAMENTOS,
  ...COMUNICACAO,
  ...VEICULOS,
  ...SADE,
  ...ACESSORIOSADE,
  ...TASER
];