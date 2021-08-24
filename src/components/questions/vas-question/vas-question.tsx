import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'vas-question',
  styleUrl: 'vas-question.css',
  shadow: false,
  scoped: true,
})
export class VasQuestion {
  @Prop() variant: any = null;
  @Prop() selected: number = 0;
  @Prop() min: number = 0;
  @Prop() max: number = 100;
  @Prop() step: number = 1;
  @Prop() labelLower: String = 'Lower-bound';
  @Prop() labelUpper: String = 'Upper-bound';

  /* computed */
  range() {
    let range = [];
    for (let i = this.min; i < this.max / 10 + 1; i++) {
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
      <div>
        <div class="class option-card">
          <div class="labels">
            <p>{this.labelLower}</p>
            <p>{this.labelUpper}</p>
          </div>
          <input name="vas" type="range" min={this.min} max={this.max} step={this.step} class="range" onInput={ev => this.emitHandler(ev)} />
          <div class="sliderticks">
            {this.range().map(n => (
              <p>{n}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
