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
          <summary className="faq__q">How do I place an order?</summary>
          <div className="faq__a">
            You can <strong>order directly through our website.</strong> Just
            add items to your cart and checkout easily. Or you can order through
            in <strong>Whatsapp</strong> also.
          </div>
        </details>

        <details className="faq__item">
          <summary className="faq__q">What is your return policy?</summary>
          <div className="faq__a">
            No worries! If your item arrives <strong>damaged</strong>, we’ll
            happily send you a <strong>replacement</strong>. And if you’d like
            to return something, just make sure to do it within{" "}
            <strong>3 days</strong> of receiving your order.
          </div>
        </details>
        <details className="faq__item">
          <summary className="faq__q"> Is Cash on Delivery available?</summary>
          <div className="faq__a">
            Yes, <strong>COD</strong> is available for all over the country.
          </div>
        </details>
        <details className="faq__item">
          <summary className="faq__q">Can I cancel or change my order?</summary>
          <div className="faq__a">
            Orders can be <strong>cancelled/modified</strong> within 12
            hours of placing
          </div>
        </details>
      </div>
    </section>
  );
}
