import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'vas-question',
  styleUrl: 'vas-question.css',
  // styleUrls: ['vas-question.horizontal.css','vas-question.vertical.css' ],
  shadow: false,
  scoped: true,
})
export class VasQuestion {
  @Prop() selected: number = 0;
  @Prop() min: number = 0;
  @Prop() max: number = 100;
  @Prop() step: number = 1;
  @Prop() labelLower: String = 'Lower-bound';
  @Prop() labelUpper: String = 'Upper-bound';
  /**
   * Options for Visual Analog Scale
   */
  @Prop() vasVertical: boolean = false;
  @Prop() vasShowSelectedValue: boolean = false;
  @Prop() vasSelectedValueLabel: string = null;

  /* computed */
  range() {
    let range = [];
    for (let i = this.min; i < this.max + 1; i = i + this.max / 10) {
      // for (let i = this.min; i < this.max / 10 + 1; i++) {
      range = [...range, i];
    }
    return range;
  }

  @Event() emitSelected: EventEmitter;
  emitHandler(event) {
    let value = event.target.value;
    this.emitSelected.emit(value);
  }

  render() {
    return (
      <div class={!this.vasVertical ? 'qr-vasQuestion-container' : 'qr-vasQuestion-container qr-vasQuestion-container-vertical'}>
        <div class={!this.vasVertical ? 'qr-vasQuestion-touch-container' : 'qr-vasQuestion-touch-container-vertical qr-vasQuestion-touch-container'}>
          <div class="class qr-question-optionCard">
            <div class={!this.vasVertical ? 'qr-vasQuestion-labels' : 'qr-vasQuestion-labels qr-vasQuestion-labels-vertical'}>
              <p class="qr-vasQuestion-lower-label">{this.labelLower}</p>
              {this.vasShowSelectedValue && (
                <p class="qr-vasQuestion-selected-value-container">
                  {this.vasSelectedValueLabel && <div class="qr-vasQuestion-selected-value-label">{this.vasSelectedValueLabel}</div>}
                  <div class="qr-vasQuestion-selected-value-display">{this.selected}</div>
                </p>
              )}
              <p class="qr-vasQuestion-upper-label">{this.labelUpper}</p>
            </div>
            <input
              name="vas"
              type="range"
              min={this.min}
              max={this.max}
              step={this.step}
              value={this.selected}
              class={!this.vasVertical ? 'qr-vasQuestion-input' : 'qr-vasQuestion-input qr-vasQuestion-input-vertical'}
              onInput={ev => this.emitHandler(ev)}
            />
            <div class={!this.vasVertical ? 'qr-vasQuestion-slider-ticks' : 'qr-vasQuestion-slider-ticks qr-vasQuestion-slider-ticks-vertical'}>
              {this.range().map(n => (
                <p>{n}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
