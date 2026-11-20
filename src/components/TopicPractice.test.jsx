import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import TopicPractice from './TopicPractice.jsx';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'en' } }) }));
vi.mock('@/components/ui/SpeakButton.jsx', () => ({ default: () => null }));

it('accepts Chinese punctuation in typed answers and retries only missed activities', () => {
  render(<TopicPractice lesson={1} />);
  const click = (name) => fireEvent.click(screen.getByRole('button', { name, exact: true }));
  const advance = () => click('Continue');
  const order = (...tokens) => {
    tokens.forEach(click);
    click('Check');
    advance();
  };
  const write = (value) => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Write in Chinese' }), { target: { value } });
    click('Check');
    advance();
  };

  click('Start');
  click('Your name');
  advance();
  order('你', '好', '吗');
  click('我很好。');
  advance();
  order('他', '好', '吗');
  fireEvent.click(screen.getByText('Write with character tiles'));
  click('你');
  click('你');
  click('Undo');
  click('好');
  expect(screen.getByRole('textbox', { name: 'Write in Chinese' }).value).toBe('你好');
  click('Check');
  advance();
  order('我', '很', '好');
  write('我不好。');
  order('你', '最近', '怎么样');
  write('我很好，谢谢！');
  expect(screen.getByText('Correct answers: 8/9')).toBeTruthy();
  click('Review mistakes (1)');
  click('How you are');
  advance();
  expect(screen.getByText('Correct answers: 1/1')).toBeTruthy();
  expect(screen.queryByRole('button', { name: /Review mistakes/ })).toBeNull();
});
