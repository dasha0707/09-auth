import css from './Footer.module.css';

async function getCurrentYear() {
  return 2026;
}

export default async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {year} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Daria Ryzhkova</p>
          <p>
            Contact us:{' '}
            <a href="mailto:student@notehub.app">
              student@notehub.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}