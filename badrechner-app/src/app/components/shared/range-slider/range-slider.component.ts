// src/app/components/shared/range-slider/range-slider.component.ts

import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true
    }
  ],
  template: `
    <div class="range-slider-container">
      <label class="form-label" [for]="inputId">{{ label }}</label>
      <div class="slider-wrapper">
        <input
          type="range"
          class="form-range custom-range"
          [id]="inputId"
          [min]="min"
          [max]="max"
          [step]="step"
          [value]="value"
          (input)="onInput($event)"
        />
        <div class="slider-labels">
          <span class="min-label">{{ min }}{{ unit }}</span>
          <span class="current-value">{{ value }}{{ unit }}</span>
          <span class="max-label">{{ max }}{{ unit }}</span>
        </div>
      </div>
      <div class="value-display">
        <strong>Aktuelle Auswahl: {{ value }}{{ unit }}</strong>
      </div>
    </div>
  `,
  styles: [`
    .range-slider-container {
      margin: 20px 0;
    }

    .slider-wrapper {
      position: relative;
      margin: 15px 0;
    }

    .custom-range {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: #dee2e6;
      outline: none;
      -webkit-appearance: none;
    }

    .custom-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #0066cc;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0, 102, 204, 0.3);
    }

    .custom-range::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #0066cc;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0, 102, 204, 0.3);
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      color: #666;
    }

    .current-value {
      font-weight: 600;
      color: #0066cc;
      font-size: 14px;
    }

    .value-display {
      text-align: center;
      margin-top: 15px;
      padding: 10px;
      background: #f8f9ff;
      border-radius: 6px;
      border: 1px solid #e3e9ff;
    }

    .form-label {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
  `]
})
export class RangeSliderComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() unit: string = '';
  @Input() inputId: string = `range-${Math.random().toString(36).substr(2, 9)}`;
  
  // 🎯 DAS WAR DAS PROBLEM - @Input() value fehlte!
  @Input() value: number = 0;  // <-- Das muss hinzugefügt werden!
  
  @Output() valueChange = new EventEmitter<number>();

  private onChange = (value: number) => {};
  private onTouched = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = Number(target.value);
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.value = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: Handle disabled state
  }
}