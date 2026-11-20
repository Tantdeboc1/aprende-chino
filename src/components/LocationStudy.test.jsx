import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import LocationStudy from './LocationStudy.jsx';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'en' } }) }));
vi.mock('@/components/ui/SpeakButton.jsx', () => ({ default: () => null }));

beforeEach(() => localStorage.clear());

it('resumes the route and offers a different map for a missed structure', () => {
  const click = (name) => fireEvent.click(screen.getByRole('button', { name }));
  const first = render(<LocationStudy />);
  click('Start');
  click('有');
  click('Continue');
  first.unmount();

  render(<LocationStudy />);
  click('Continue studying');
  expect(screen.getByText('2/6')).toBeTruthy();
  click('有');
  click('Continue');
  click('是');
  click('Continue');
  expect(within(screen.getByRole('list')).getByText('Hospital')).toBeTruthy();

  for (const tiles of [
    ['医院', '在', '学校左边'],
    ['学校左边', '有', '一家医院'],
    ['学校右边', '是', '饭馆'],
  ]) {
    tiles.forEach(click);
    click('Check');
    click('Continue');
  }

  click('Review with another map (1)');
  expect(within(screen.getByRole('list')).getByText('Station')).toBeTruthy();
  expect(screen.getByText('1/1')).toBeTruthy();
});
