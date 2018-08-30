import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { UsuarioDTO } from "../../models/usuario.dto";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../storage.service";

@Injectable()
export class UsuarioService {
    
    constructor(public http: HttpClient, public storage: StorageService) {

    }

    findAll() : Observable<UsuarioDTO[]> {
       return this.http.get<UsuarioDTO[]>(`${API_CONFIG.baseUrl}/usuarios`);
    }

    findByEmail(email: string) : Observable<UsuarioDTO> {
       return this.http.get<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuarios/email?value=${email}`);
    }

}