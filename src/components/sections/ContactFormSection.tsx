"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import { RevealHeadingLine } from "@/components/reactbits/RevealHeadingLine";

type SubmitStatus = "idle" | "sending" | "sent" | "error" | "not-configured";

const HEADING_CLASS =
  "text-center text-[20vw] uppercase leading-none text-em-invert-text sm:text-[12vw]";

/**
 * ContactFormSection - heading, paragraph, and EmailJS-wired contact form
 * for the standalone /contact page. Matches jasminemaduafokwa.com/contact's
 * "Let's get in touch" heading (live-DOM measured: two overflow-hidden
 * lines, translateY(100%)->0% reveal, "get"/"in" as italic-lowercase inline
 * spans) and its underline-only form fields.
 */
export function ContactFormSection() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const paragraphInView = useInView(paragraphRef, { once: true, margin: "-80px" });
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("not-configured");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(serviceId, templateId, event.currentTarget, { publicKey });
      setStatus("sent");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto w-full px-6 py-[8vh] sm:w-[75%] md:w-[60%] md:px-0">
      <RevealHeadingLine className={HEADING_CLASS}>
        Let&apos;s <span className="italic lowercase">get</span>
      </RevealHeadingLine>
      <RevealHeadingLine delay={0.1} className={HEADING_CLASS}>
        <span className="italic lowercase">in</span> touch
      </RevealHeadingLine>

      <div className="flex justify-end">
        <motion.p
          ref={paragraphRef}
          initial={{ opacity: 0 }}
          animate={paragraphInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-[70%] text-[13.5px] text-em-invert-muted sm:w-[60%] sm:text-[15px] md:w-[55%] 2xl:text-[24px]"
        >
          Have a project in mind or an opportunity to talk through? Fill out the form below and
          I&apos;ll get back to you shortly.
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="mt-14">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-1 flex-col gap-y-2">
            <label htmlFor="name" className="text-[14px] text-em-invert-text">
              Name *
            </label>
            <input
              id="name"
              name="user_name"
              type="text"
              required
              className="border-b-[1.5px] border-b-em-invert-text bg-transparent px-2 py-2 text-em-invert-text outline-none"
            />
          </div>
          <div className="flex flex-1 flex-col gap-y-2">
            <label htmlFor="email" className="text-[14px] text-em-invert-text">
              Email *
            </label>
            <input
              id="email"
              name="user_email"
              type="email"
              required
              className="border-b-[1.5px] border-b-em-invert-text bg-transparent px-2 py-2 text-em-invert-text outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-y-2">
          <label htmlFor="message" className="text-[14px] text-em-invert-text">
            Message *
          </label>
          <textarea
            id="message"
            name="user_message"
            rows={3}
            required
            className="border-b-[1.5px] border-b-em-invert-text bg-transparent px-2 py-2 text-em-invert-text outline-none"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full border border-em-invert-text py-2 text-[16px] text-em-invert-text duration-300 hover:bg-em-accent hover:text-em-invert-bg disabled:opacity-50 sm:w-[45%] 2xl:text-[26px]"
          >
            {status === "sending" ? "Sending..." : "Submit"}
          </button>
          {status === "sent" && (
            <p className="mt-3 text-[13px] text-em-invert-muted">Message sent — thank you!</p>
          )}
          {status === "error" && (
            <p className="mt-3 text-[13px] text-em-accent">
              Something went wrong sending that — email me directly instead.
            </p>
          )}
          {status === "not-configured" && (
            <p className="mt-3 text-[13px] text-em-accent">
              The contact form isn&apos;t wired up yet — email me directly instead.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

export default ContactFormSection;
