import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  registerForm!: FormGroup;
  submitted = false;
  isRegisterFailed = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService){}
  
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role :['USER', Validators.required]
    });
  }

  onSubmit(): void{
    this.submitted = true;
    if(this.registerForm.invalid){
      return;
    }

    const { firstName, lastName, username, password, role } = this.registerForm.value;

    this.authService.register(firstName, lastName, username, password, role).subscribe({
      next: () => {
        console.log('Registration successful')
      },
      error: (err) =>{
        this.isRegisterFailed = true || 'Une erreur est survenue.'
      }
    })
  }

}
