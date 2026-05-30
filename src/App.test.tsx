import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

beforeEach(() => localStorage.clear());

describe('App flow', () => {
  it('starts on the name picker', () => {
    render(<App />);
    expect(screen.getByText('Kies je naam')).toBeInTheDocument();
  });

  it('selects a participant, persists it, and shows the home tab', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Bas/ }));

    expect(screen.getByText('Hey,')).toBeInTheDocument();
    expect(screen.getByText('Jouw indeling per fase')).toBeInTheDocument();
    expect(localStorage.getItem('rz_user')).toBe('Bas');
  });

  it('restores the saved participant on reload', () => {
    localStorage.setItem('rz_user', 'Elske');
    render(<App />);
    expect(screen.queryByText('Kies je naam')).not.toBeInTheDocument();
    expect(screen.getAllByText('Elske').length).toBeGreaterThan(0);
  });

  it('navigates between tabs via the bottom nav', async () => {
    localStorage.setItem('rz_user', 'Bas');
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /Spelregels/ }));
    expect(screen.getByRole('heading', { name: 'Spelregels' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Fase 2/ }));
    expect(screen.getByText('Optimisme, kritiek & realisme')).toBeInTheDocument();
  });

  it('returns to the picker when changing user', async () => {
    localStorage.setItem('rz_user', 'Bas');
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /Naam wijzigen/ }));
    expect(screen.getByText('Kies je naam')).toBeInTheDocument();
    expect(localStorage.getItem('rz_user')).toBeNull();
  });
});
