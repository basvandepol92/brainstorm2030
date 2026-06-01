import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Outcome, VotingConfig } from '../../session/types';
import { VotingTab } from './VotingTab';

const outcomes: Outcome[] = [
  { id: 'a', text: 'AI-propositie', createdAt: '' },
  { id: 'b', text: 'Community voor Rockstars', createdAt: '' },
  { id: 'c', text: 'Regionale consultancy', createdAt: '' },
];

function cfg(over: Partial<VotingConfig> = {}): VotingConfig {
  return { open: true, resultsRevealed: false, dotsPerVoter: 2, ...over };
}

describe('VotingTab', () => {
  it('shows a closed message when voting is not open', () => {
    render(
      <VotingTab
        outcomes={outcomes}
        voting={cfg({ open: false })}
        myVote={[]}
        tallies={null}
        votesCast={0}
        onVote={vi.fn()}
      />,
    );
    expect(screen.getByText(/op dit moment gesloten/i)).toBeInTheDocument();
  });

  it('lets you select up to the dot limit and submits the chosen ids', async () => {
    const onVote = vi.fn().mockResolvedValue(undefined);
    render(
      <VotingTab
        outcomes={outcomes}
        voting={cfg({ dotsPerVoter: 2 })}
        myVote={[]}
        tallies={null}
        votesCast={3}
        onVote={onVote}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /AI-propositie/ }));
    await userEvent.click(screen.getByRole('button', { name: /Community voor Rockstars/ }));

    // Third option is now disabled (limit of 2 reached).
    expect(screen.getByRole('button', { name: /Regionale consultancy/ })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: /Stem vastleggen/i }));
    expect(onVote).toHaveBeenCalledTimes(1);
    expect(onVote.mock.calls[0][0]).toEqual(['a', 'b']);
  });

  it('renders the tally with the leader highlighted when results are revealed', () => {
    render(
      <VotingTab
        outcomes={outcomes}
        voting={cfg({ open: false, resultsRevealed: true })}
        myVote={[]}
        tallies={{ a: 5, b: 2, c: 0 }}
        votesCast={7}
        onVote={vi.fn()}
      />,
    );
    expect(screen.getByText('Uitslag')).toBeInTheDocument();
    // Top-9 carry-forward is communicated and counted.
    expect(screen.getByText(/top 9/i)).toBeInTheDocument();
    expect(screen.getByText(/hebben gestemd/i)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
