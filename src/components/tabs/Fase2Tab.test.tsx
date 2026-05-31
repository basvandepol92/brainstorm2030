import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ROLES } from '../../data/roles';
import { findByName } from '../../data/selectors';
import { PEOPLE } from '../../data/people';
import { Fase2Tab } from './Fase2Tab';

describe('Fase2Tab', () => {
  it('hides the role until "Toon mijn rol" is clicked, then reveals card + questions', async () => {
    const user = userEvent.setup();
    const julia = findByName(PEOPLE, 'Julia')!; // villain
    render(<Fase2Tab user={julia} />);

    // The role card (and its questions) is hidden behind the reveal button.
    expect(screen.queryByText('Jij geeft antwoorden op vragen als:')).not.toBeInTheDocument();
    expect(screen.queryByText(ROLES.villain.questions[0])).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /toon mijn rol/i }));

    expect(screen.getAllByText('Villain').length).toBeGreaterThan(0);
    expect(screen.getByText('Jij geeft antwoorden op vragen als:')).toBeInTheDocument();
    for (const q of ROLES.villain.questions) {
      expect(screen.getByText(q)).toBeInTheDocument();
    }
  });

  it('lists groupmates including the user', () => {
    const julia = findByName(PEOPLE, 'Julia')!; // f2 Groep 2
    render(<Fase2Tab user={julia} />);
    expect(screen.getByText('Julia')).toBeInTheDocument();
    expect(screen.getByText('Richard')).toBeInTheDocument();
  });
});
