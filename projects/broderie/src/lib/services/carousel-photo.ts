import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CarouselPhoto} from '../../../../common/carousel-photo';
import {HttpClient} from '@angular/common/http';
import {ToastService} from 'angular-toastify';
import {environment} from '../../../../../src/environments/environment';
import {TOKEN} from '../../../../../src/app/app.token';
import {Token} from '../../../../auth/src/lib/services/token';

@Injectable({providedIn: 'root'})
export class CarouselPhotoService {
  private carouselPhotoUpdated: BehaviorSubject<CarouselPhoto[]> = new BehaviorSubject<CarouselPhoto[]>([]);

  constructor(private http: HttpClient,
              private toastService: ToastService,
              @Inject(TOKEN) private token: Token) {
  }

  getCarouselPhotoListener(): Observable<CarouselPhoto[]> {
    return this.carouselPhotoUpdated.asObservable();
  }

  getCarouselPhotos(): void {
    this.http.get<CarouselPhoto[]>(`${environment.appApi}/carousel-photos`)
      .subscribe((photos: CarouselPhoto[]) => {
        this.carouselPhotoUpdated.next(photos);
      });
  }

  createCarouselPhoto(carouselPhoto: CarouselPhoto): void {
    this.http.post<CarouselPhoto>(`${environment.appApi}/carousel-photo`,
      {
        carouselPhoto
      },
      {
        headers: {
          authtoken: this.token.token.getValue()
        }
      })
      .subscribe(success => {
        this.getCarouselPhotos();
        this.toastService.success(`Fotografia ${carouselPhoto.name} a fost adăugata cu succes în carusel„`);
      },
        error => {
        this.toastService.error('Fotografia nu a fost adăugată în carusel');
        });
  }

  removeCarouselPhoto(slug: string): void {
    this.http.delete<CarouselPhoto>(`${environment.appApi}/carousel-photo/${slug}`,
      {
        headers: {
          authtoken: this.token.token.getValue()
        }
      })
      .subscribe(() => {
        this.toastService.success('Fotografia a fost ștearsă');
        this.getCarouselPhotos();
      },
        (error => {
          this.toastService.error('Nu s-a putut șterge fotografia');
        }));
  }
}
