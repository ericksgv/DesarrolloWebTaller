import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostusuarioComponent } from './postusuario.component';

describe('PostusuarioComponent', () => {
  let component: PostusuarioComponent;
  let fixture: ComponentFixture<PostusuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostusuarioComponent]
    });
    fixture = TestBed.createComponent(PostusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
