import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { ContaDTO } from "../../models/conta.dto";
import { StorageService } from "../storage.service";
import { Observable } from "rxjs";

@Injectable()
export class ContaService {
    
    constructor(
        public http: HttpClient, 
        public storage: StorageService
    ) {

    }

    
    create(obj: ContaDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/contas`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
    
    
    read(id : number) : Observable<ContaDTO[]> {
        return this.http.get<ContaDTO[]>(`${API_CONFIG.baseUrl}/contas/${id}`);
    }


    readAll() : Observable<ContaDTO[]> {
        return this.http.get<ContaDTO[]>(`${API_CONFIG.baseUrl}/contas`);
    }


    update(obj: ContaDTO){
        return this.http.put(
            `${API_CONFIG.baseUrl}/contas/${obj.id}`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }


    delete(id : number){
        return this.http.delete(`${API_CONFIG.baseUrl}/contas/${id}`);
    };


    lastSaldo(contaId){
        return this.http.get<ContaDTO[]>(`${API_CONFIG.baseUrl}/contas/${contaId}/saldos`);
    }
}