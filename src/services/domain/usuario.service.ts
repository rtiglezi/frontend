import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { UsuarioDTO } from "../../models/usuario.dto";
import { Observable } from "rxjs/Rx";

@Injectable()
export class UsuarioService {
    
    constructor(public http: HttpClient) {

    }

    findAll() : Observable<UsuarioDTO[]> {
       return this.http.get<UsuarioDTO[]>(`${API_CONFIG.baseUrl}/usuarios`);
    }

}