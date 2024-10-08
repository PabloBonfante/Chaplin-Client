import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/auth.service';
import { Usuario } from '../../Models/usuario';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentUser!: Usuario | null;
  constructor(private loginService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.loginService.getUserFromLocalStorage();
  }
}
