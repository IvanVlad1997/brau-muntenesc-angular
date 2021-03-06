import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Image} from '../../../../common/image';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../../auth/src/lib/services/auth';
import {ToastService} from 'angular-toastify';
import {environment} from '../../../../../src/environments/environment';
import {TOKEN} from '../../../../../src/app/app.token';
import {Token} from '../../../../auth/src/lib/services/token';

@Injectable({providedIn: 'root'})
export class ImageService {
  private imagesUpdate: BehaviorSubject<Image[]> = new BehaviorSubject<Image[]>([]);

  constructor(private http: HttpClient,
              private authService: AuthService,
              private toastService: ToastService,
              @Inject(TOKEN) private token: Token) {
  }


  getImagesListener(): Observable<Image[]> {
    return this.imagesUpdate.asObservable();
  }

  getPhotos(): void {
    this.http.get<Image[]>(`${environment.appApi}/images`)
      .subscribe((photos: Image[]) => {
        this.imagesUpdate.next(photos);
      });
  }

  createPhoto(image: Image): void {
    this.http.post<Image>(`${environment.appApi}/image`,
      {
        image
      },
      {
        headers: {
          authtoken: this.token.token.getValue()
        }
      })
      .subscribe(success => {
          this.getPhotos();
          this.toastService.success(`Fotografia ${image.name} a fost adăugata cu succes în carusel„`);
        },
        error => {
          console.log(error);
          this.toastService.error('Fotografia nu a fost adăugată în carusel');
        });
  }

  removePhoto(slug: string): void {
    this.http.delete<Image>(`${environment.appApi}/image/${slug}`,
      {
        headers: {
          authtoken: this.token.token.getValue()
        }
      })
      .subscribe(() => {
          this.toastService.success('Fotografia a fost ștearsă');
          this.getPhotos();
        },
        (error => {
          this.toastService.error('Nu s-a putut șterge fotografia');
        }));
  }
}
