import { ContaDTO } from "./conta.dto";

export interface SaldoDTO {
    id : string;
    mes : string;
    ano : string;
    saldoMesAnterior : string;
    somaReceitasCorrentes : string;
    somaReceitasExtras : string;
    saldoMes : string;
    somaGastosExtras : string;
    somaInvestimentos : string;
    somaDespesasCorrentes : string;
    conta : ContaDTO;
}

