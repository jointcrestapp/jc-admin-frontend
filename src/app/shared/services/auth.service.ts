import { HttpClient } from "@angular/common/http";
import { Injectable, signal, computed } from "@angular/core";
import { AuthModel } from "../interface/auth.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  private initialState = signal<AuthModel>({
    email: '',
    token: '',
    access_token: null,
    permissions: []
  });

  email = computed(() => this.initialState().email);
  token =  computed(() => this.initialState().token);
  access_token = computed(() => this.initialState().access_token);
  permissions = computed(() => this.initialState().permissions);

  constructor(private http: HttpClient) {}

  // Auth logic here

}
