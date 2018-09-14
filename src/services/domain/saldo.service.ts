import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { Observable } from "rxjs";
import { SaldoDTO } from "../../models/saldo.dto";

@Injectable()
export class SaldoService {
    
    constructor(
        public http: HttpClient, 
        public storage: StorageService
    ) {

    }

    
    create(obj: SaldoDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/saldos`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
    
    
    read(id : number) : Observable<SaldoDTO[]> {
        return this.http.get<SaldoDTO[]>(`${API_CONFIG.baseUrl}/saldos/${id}`);
    }


    update(obj: SaldoDTO){
        return this.http.put(
            `${API_CONFIG.baseUrl}/saldos/${obj.id}`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }


    delete(id : number){
        return this.http.delete(`${API_CONFIG.baseUrl}/saldos/${id}`);
    };

}