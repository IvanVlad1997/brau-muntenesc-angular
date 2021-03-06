import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from 'angular-toastify';
import {UserService} from '../../services/user';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../../../auth/src/lib/services/auth';

@Component({
  selector: 'lib-change-user-prop-dialog',
  templateUrl: './change-user-prop-dialog.component.html',
  styleUrls: ['./change-user-prop-dialog.component.scss']
})
export class ChangeUserPropDialogComponent implements OnInit, OnDestroy {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any ,
              private ref: MatDialogRef<ChangeUserPropDialogComponent>,
              private toastService: ToastService,
              private userService: UserService,
              private authService: AuthService) { }


  userSubscription: Subscription;
  authSubscription: Subscription;
  token: string = '';

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if  (this.userSubscription)  {
      this.userSubscription.unsubscribe();
    }
  }

  async edit(): Promise<void> {
    if (this.data.isName) {
      this.userSubscription =  await this.userService.changeUserName(this.data.name);
    } else if (this.data.isTelNum) {
      this.userSubscription =  await this.userService.changeTelNul(this.data.telNum);
    }
    // else if (this.data.isEmail) {
    //   this.userSubscription =  this.userService.changeEmail(this.data.email, this.token)
    // }
    this.ref.close();
  }

}
