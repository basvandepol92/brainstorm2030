import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PEOPLE } from '../data/people';
import { NamePicker } from './NamePicker';

describe('NamePicker', () => {
  it('renders every participant as a button, alphabetically', () => {
    render(<NamePicker onSelect={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(PEOPLE.length);
    expect(buttons[0]).toHaveTextContent('Anne-Sophie');
  });

  it('calls onSelect with the chosen person', async () => {
    const onSelect = vi.fn();
    render(<NamePicker onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Julia/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Julia', rol: 'villain' });
  });
});
