import { Injectable } from "@angular/core";
import { LoginUser } from "./models/loginUser";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelper, tokenNotExpired } from "angular2-jwt";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { RegisterUser } from "./models/registerUser";
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class AuthService {
  path = "https://localhost:44301/api/Auth/";
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelper = new JwtHelper();
  TOKEN_KEY="token";
  LAST_URL_KEY = "lastUrl";
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastr: ToastrService // ToastrService injected
  ) {}

  login(loginUser: LoginUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
  
    this.httpClient
      .post<{ token: string }>(this.path + "login", loginUser, { headers: headers })
      .subscribe(
        (response) => {
          const token = response.token;
          
          this.saveToken(token); // Token'ı kaydedin
          this.userToken = token;
          this.decodedToken = this.jwtHelper.decodeToken(token); // Token'ı decode edin
          this.toastr.success("Başarıyla giriş yaptınız!", "Başarılı"); // Başarı mesajı
          const lastUrl = localStorage.getItem(this.LAST_URL_KEY) || '/tasinmaz-table'; // Son URL'yi al veya varsayılan olarak yönlendir
          this.router.navigateByUrl(lastUrl); // Yönlendirme
          localStorage.removeItem(this.LAST_URL_KEY); // URL'yi temizle
        },
        (error) => {
          console.error('Giriş Hatası:', error);
          this.toastr.error(
            "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
            "Hata"
          );
        }
      );
  }
  

  register(registerUser: RegisterUser): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    return this.httpClient.post(this.path + "register", registerUser, { headers: headers });
  }

  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.toastr.success('Başarıyla çıkış yapıldı.', 'Çıkış Başarılı'); // Başarı mesajı
    this.router.navigateByUrl('/login'); // Kullanıcıyı giriş sayfasına yönlendir
  }

  loggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const isValidToken = token != null && !this.jwtHelper.isTokenExpired(token);
    
    return isValidToken;
  }
  

  get token(){
    return localStorage.getItem(this.TOKEN_KEY);
  }


  getCurrentUserId(): number | null {
    if (!this.token) return null;
    
    const decodedToken = this.jwtHelper.decodeToken(this.token);
     

    return decodedToken['nameid'] || decodedToken['userId'] || null; // Kullanıcı ID'sini doğru claim ile alın
  }
  getCurrentUserRole(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY); // TOKEN_KEY kullanılarak token alınır
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken['role'] || null; // 'role' doğru claim alanı olmalıdır
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'Admin';
  }

}
