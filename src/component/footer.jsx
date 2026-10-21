import React from 'react'

const Footer = () => {
  return (
  <div className="bg-[radial-gradient(circle_at_90%_100%,rgba(15, 2, 7, 0.35),transparent_55%)] pb-8 pt-20 text-white  bg-black">
    <div className="mx-auto max-w-[1100px] px-5 sm:px-12">

      <div className="flex flex-wrap items-center justify-between gap-8 border-b border-white/20 pb-10">
        <h2 className="max-w-[12ch] text-[clamp(2.2rem,5.5vw,4.2rem)] font-light leading-[1.1] tracking-tight">Ready to talk about your project?</h2>
        <a href="mailto:hello@kijo.example" className="grid size-34 place-items-center rounded-full border border-white text-center text-[.9rem] transition hover:bg-white hover:text-[#18181a]" style={{ width: '8.5rem', height: '8.5rem' }}>Talk to Kijo</a>
      </div>

      <div className="grid gap-8 pt-10 text-[.9rem] md:grid-cols-[1fr_1.7fr]">
        <div className="[&_p:not(.label)]:mb-5">
          <p className="label">Find us</p>
          <p>1 Studio Lane City, Postcode</p>
          <p className="label">Contact us</p>
          <p>+00 000 000 0000 hello@kijo.example</p>
          <p className="label">Follow us</p>
          <p>Ig&nbsp;&nbsp;In&nbsp;&nbsp;Pi</p>
        </div>

        <div>
          <p className="label">What we do</p>
          <ul className="tags"><li className="pill">Residential</li><li className="pill">Commercial</li><li className="pill">Hospitality</li><li className="pill">Masterplanning</li><li className="pill">Interiors</li><li className="pill">Sustainability</li></ul>

          <p className="label mt-8">Sign up to our newsletter</p>
          <form action="#" method="post" className="mt-2 flex items-center border-b border-white focus-within:border-[#8a9bff]">
            <label htmlFor="email" className="sr-only">Your email</label>
              <input id="email" name="email" type="email" required placeholder="Your email"
                     className="flex-1 bg-transparent py-3.5 text-[1.1rem] text-white outline-none placeholder:text-white/75" />
            <button type="submit" aria-label="Subscribe" className="group p-2">
              <span aria-hidden="true" className="relative block h-px w-10 bg-current transition-all group-hover:w-14 after:absolute after:-top-[3px] after:right-0 after:size-[7px] after:rotate-45 after:border-r after:border-t after:border-current"></span>
            </button>
          </form>
          <p className="mt-3 text-xs opacity-55">By submitting you agree to our Privacy Policy</p>
        </div>
      </div>

      <p className="mt-12 text-xs opacity-55">Copyright 2026 Kijo Architecture</p>
    </div>
  </div>
  );
}

export default Footer