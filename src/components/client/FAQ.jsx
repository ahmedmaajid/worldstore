import React from "react";

export default function FAQ() {
  return (
    <section className="faq">
      <div className="faq__heading d-flex flex-column">
        <h2 className="faq__title">Frequently Asked Questions</h2>
        <p>Quick answers to common questions</p>
      </div>
      <div className="faq__list">
        <details className="faq__item">
          <summary className="faq__q">How fast is shipping?</summary>
          <div className="faq__a">
            Most orders arrive within <strong>3–5 business days</strong> with
            standard shipping.
          </div>
        </details>

        <details className="faq__item">
          <summary className="faq__q">What is your return policy?</summary>
          <div className="faq__a">
            We offer a <strong>30-day hassle-free return</strong> on all unused
            products.
          </div>
        </details>

        <details className="faq__item">
          <summary className="faq__q">Do you ship internationally?</summary>
          <div className="faq__a">
            Yes, we ship to <strong>40+ countries worldwide</strong>. Shipping
            fees may vary.
          </div>
        </details>
      </div>
    </section>
  );
}
