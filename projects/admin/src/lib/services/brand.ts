import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../../auth/src/lib/services/auth';
import {ToastService} from 'angular-toastify';
import {environment} from '../../../../../src/environments/environment';
import {Program} from '../../../../common/program';
import {Brand} from '../../../../common/brand';
import {TOKEN} from '../../../../../src/app/app.token';
import {Token} from '../../../../auth/src/lib/services/token';

@Injectable({providedIn: 'root'})
export class BrandService {

  private brandUpdated: BehaviorSubject<Brand[]> = new BehaviorSubject<Brand[]>([]);

  constructor(private http: HttpClient,
              private authService: AuthService,
              private toastService: ToastService,
              @Inject(TOKEN) private token: Token) {
  }

  getBrandListener(): Observable<Brand[]> {
    return this.brandUpdated.asObservable();
  }

  getBrands(): void {
    this.http.get<Brand[]>(`${environment.appApi}/brands`)
      .subscribe((brands: Brand[]) => {
        this.brandUpdated.next(brands);
      });
  }


  brandCreate(brand: Brand): void {
    this.http.post<Brand>(`${environment.appApi}/brand`,
      {
        name: brand.name,
        email: brand.email
      },
      {
        headers: {
          authtoken: this.token.token.getValue()
        }
      })
      .subscribe(success => {
          this.getBrands();
          this.toastService.success(`Brandul ${brand.name} a fost creat cu succes!`);
        },
        err => {
          console.log(err);
          this.toastService.error(`Nu s-a crea Pretul.`);
        });
  }

  programUpdate(slug: string, brand: Brand): void {
    this.http.put<Brand>(`${environment.appApi}/brand/${slug}`,
      {
        name: brand.name,
        email: brand.email
      },
      {
        headers: {
          authtoken: this.token.token.getValue()
        }
      })
      .subscribe(p => {
          this.toastService.success(`Videoul ${brand.name} a fost editat cu succes!`);
          this.getBrands();
        },
        (err) => {
          this.toastService.error(`Nu s-a putut edita Videoul.`);
        });
  }

  programRemove(slug: string): void {
    this.http.delete<Brand>(`${environment.appApi}/brand/${slug}`,
      {
        headers: {
          authtoken: this.token.token.getValue()
        }
      })
      .subscribe(() => {
          this.toastService.success('Videoul a fost ștears!');
          this.getBrands();
        },
        (err) => {
          this.toastService.error('Nu s-a putut șterge Videoul!');
        });
  }

}
