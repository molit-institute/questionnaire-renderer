import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'simple-spinner',
  styleUrl: 'simple-spinner.css',
  shadow: true,
})
export class SimpleSpinner {
  @Prop() borderTopColor: string = '#004A6B';
  @Prop() message: String;

  render() {
    return (
      <div class="qr-spinner-container">
        <div class="qr-spinner-element" id="loading" style={{ borderTopColor: this.borderTopColor }}></div>
        {this.message.length > 0 ? (
          <div class="qr-spinner-text">
            {this.message}
          </div>
        ) : null}
      </div>
    );
  }
}
