import { TokenStorageService } from './../../services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotOnlyWhitespaceValidator } from '../../validators/notOnlyWhitespaceValidator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  
  loginForm!: FormGroup;
  errorMessage: string | null =null;

  constructor( private formBuilder: FormBuilder,
               private authService: AuthService,
               private tokenStorageService: TokenStorageService,
               private router: Router){
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['',[Validators.required, Validators.minLength(6), NotOnlyWhitespaceValidator.notOnlyWhitespace]],
      password: ['',[Validators.required, Validators.minLength(6), NotOnlyWhitespaceValidator.notOnlyWhitespace]]
    });
    
  }

  onSubmit() {
    if(this.loginForm.valid){
      const {username, password} = this.loginForm.value;

      this.authService.login(username, password).subscribe(
        (response) => {
          console.log('Login succeful !', response);
          
          // recuperation du role 
          const role = localStorage.getItem('role');
          console.log(role);

          // Rediriger en fonction du role 
          if(role==='ADMIN'){
            this.router.navigate(['/admin'])
          }else if(role==='USER'){
            this.router.navigate(['/user'])
          }else{
            this.router.navigate(['/'])
          }
        },
        (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid username or password';
        }
      );
    }
  }

  
}
