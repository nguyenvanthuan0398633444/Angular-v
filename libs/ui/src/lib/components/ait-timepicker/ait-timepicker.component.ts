/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ait-timepicker',
  templateUrl: 'ait-timepicker.component.html',
  styleUrls: ['./ait-timepicker.component.scss']

})

export class AitTimepickerComponent implements OnChanges, OnInit {
  constructor() {
    this.timeChanged = new FormControl('');


  }

  timeChanged: FormControl;
  @Input() isTuples = true;
  @Input() ishourValue;
  @Input() isminuteValue;
  @Output() watchValue = new EventEmitter();
  @Input() placeholder;
  hourField: string;
  minField: string;
  @Input() isReset = false;
  @Input() id;
  @Input() step;
  currentValue: any;
  isOpen = false;
  hours: any[];
  minutes: any[];
  @Input() defaultValue;
  @Input() fieldName: string;
  @Input() mode: 'dark' | 'light' = 'light';
  @Input() isTwelveFormat;
  @Input() time;
  timeExact;
  textCompared = '';
  @Input() isError = false;
  @Input() isSuccess = false;

  @ViewChild('inputTimepicker') inputTimepicker: ElementRef;

  ngOnInit() {
    const step = this.step ? this.step : this.STEP;
    const hour = this.isTwelveFormat ? 12 : 24;
    this.hours = Array.from({ length: hour / step - 1 }, (_, i) => this.getNum((i + 1) * step));
    this.minutes = Array.from({ length: 60 / step }, (_, i) => this.getNum((i) * step));
  }

  ID(element: string): string {
    return this.id + '_' + element;
  }

  getTimeText = () => this.ishourValue ? '時' : '分';

  getContentTime = () => this.ishourValue ? this.hours : this.minutes;

  openPanel = () => this.isOpen = true;


  getNum = (num: number) => {
    if (num === null || num === undefined) {
      return null;
    }
    return num.toString().length >= 2 ? num.toString() : '0' + num;
  }


  get PLACEHOLDER(): string {
    return this.placeholder ? this.placeholder
      : this.ishourValue ? 'HH' : 'mm'
  }

  get TIME_FORMAT(): string {
    return this.ishourValue ? 'HH' : 'mm';
  }

  get STEP(): number {
    return this.ishourValue ? 1 : 5;
  }

  onEnter = () => {
    this.inputTimepicker.nativeElement.blur();
  }


  handleInput = (value) => {
    const validNumber = value ? Number(value) : null;
    this.currentValue = validNumber;
    if (!isNaN(this.currentValue)) {
      if (this.ishourValue) {
        if (this.currentValue > 0) {
          this.textCompared = this.getNum(value);
        }
      }
      else {
        this.textCompared = this.getNum(value);
      }
    }
    else {

    }
  }

  focusout = () => {
    setTimeout(() => {
      const target = this.currentValue === null ? null : Number(this.currentValue);
      let res;
      if (target !== null) {
        if (this.ishourValue) {
          if (this.isTwelveFormat) {
            res = (target > 11 || target < 1) ? null : target;
          }
          else {
            res = (target > 23 || target < 1) ? null : target;
          }
        }
        else {
          if (target === 60) {
            res = 0
          }
          else if (target > 60) {
            res = null;
          }
          else {
            res = target;
          }
        }
      }
      this.currentValue = res;
      // console.log(this.currentValue);
      if (!isNaN(Number(this.currentValue))) {
        if (this.ishourValue) {
          if (this.currentValue > 0) {
            this.timeExact = this.getNum(this.currentValue);
            this.watchValue.emit({
              value: { [this.fieldName]: Number(this.timeExact) }
            })

          }
          else {
            this.timeExact = null;
            this.watchValue.emit({
              value: { [this.fieldName]: null }
            })

          }
        }
        else {
          this.timeExact = this.getNum(this.currentValue);
          this.watchValue.emit({
            value: { [this.fieldName]: this.timeExact ? Number(this.timeExact) : null }
          })
        }
      }
      else {
        // console.log(this.currentValue)
        this.timeExact = null;
        this.watchValue.emit({
          value: { [this.fieldName]: null }
        })

      }
      this.isOpen = false;
    }, 100)


  }

  onSelectTime = (value) => {

    this.timeExact = value;
    this.currentValue = value;
    this.isOpen = false;

  }

  onKeyDown = (event) => {
    const BIRTHNUMBER_ALLOWED_CHARS_REGEXP = /[0-9]+/;
    // console.log(event.data)
    if (!BIRTHNUMBER_ALLOWED_CHARS_REGEXP.test(event.data)) {
      event.preventDefault();
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'defaultValue') {
          if (this.defaultValue || [0, '0', '00'].includes(this.defaultValue)) {
            const num = Number(this.defaultValue);
            this.currentValue = num;
            if (!isNaN(num)) {
              if (this.ishourValue) {
                if (num > 0) {

                  this.timeExact = this.getNum(this.defaultValue);
                  this.textCompared = this.timeExact;
                  this.watchValue.emit({
                    value: { [this.fieldName]: Number(this.timeExact) }
                  })
                }
                else {
                  this.timeExact = null;
                  this.textCompared = this.timeExact;

                  this.watchValue.emit({
                    value: { [this.fieldName]: null }
                  })
                }
              }
              else {
                this.timeExact = this.getNum(this.defaultValue);
                this.textCompared = this.timeExact;
                this.watchValue.emit({
                  value: { [this.fieldName]: Number(this.timeExact) }
                })
              }
            }
            else {
              this.timeExact = this.getNum(this.defaultValue);
              this.textCompared = this.timeExact;

              this.watchValue.emit({
                value: { [this.fieldName]: Number(this.timeExact) }
              })
            }
          }
          else {
            this.timeExact = null;
            this.textCompared = this.timeExact;

            this.watchValue.emit({
              value: { [this.fieldName]: null }
            })
          }
        }

        if (key === 'isReset') {
          if (this.isReset) {
            this.currentValue = null;

            this.timeExact = this.defaultValue || this.currentValue || undefined;
            // console.log(this.timeExact, this.defaultValue, this.currentValue)
            this.watchValue.emit({
              value: { [this.fieldName]: !isNaN(Number(this.timeExact)) ? Number(this.timeExact) : null }
            })
          }
        }

      }
    }
  }
  // new Date(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]]);

  checkObjecthasValue = (time) => {
    let res = false;
    Object.entries(time || {}).forEach(([key, value]) => {
      if (value) {
        res = true;
      }
    })
    return res;
  }






}
