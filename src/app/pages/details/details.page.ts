import { Component, OnInit } from '@angular/core';
import { Produto } from 'src/app/interfaces/produto';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  private produto: Produto = {};
  private loading: any;
  private produtoId: string = null;
  private produtoSubscription: Subscription;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private produtoService: ProdutoService,
    private navCtrl: NavController
  ) {
    this.produtoId = this.activeRoute.snapshot.params['id'];

    if (this.produtoId) this.loadProduto();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.produtoSubscription) this.produtoSubscription.unsubscribe();
  }

  loadProduto() {
    this.produtoSubscription = this.produtoService.getProduto(this.produtoId).subscribe(data => {
      this.produto = data;
    });
  }

  async saveProduto() {
    await this.presentLoading();

    this.produto.userId = this.authService.getAuth().currentUser.uid;

    if (this.produtoId) {
      try {
        await this.produtoService.updateProduto(this.produtoId, this.produto);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast(error.message);
        this.loading.dismiss();
      }
    } else {
      this.produto.createdAt = new Date().getTime();
      try {
        await this.produtoService.addProduto(this.produto);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast(error.message);
        this.loading.dismiss();
      }
    }
  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Por favor, aguarde...'
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
