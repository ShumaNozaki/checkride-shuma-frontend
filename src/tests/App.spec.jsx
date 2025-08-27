import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => 'mocked-url');
  global.URL.revokeObjectURL = vi.fn();
});

describe('音声認識フロントエンド（実API）', () => {
  test('音声ファイルをアップロードして送信できる', async () => {
    render(<App />);

    // ファイル入力を取得
    const fileInput = screen.getByTestId('audio-input'); 
    const file = new File(['RIFF....'], 'ja-JP_Broadband-sample.wav', { type: 'audio/wav' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // 送信ボタンを取得
    const sendBtn = screen.getByRole('button', { name: /✓ 送信/i });
    fireEvent.click(sendBtn);

    // 結果が表示されるのを待つ
    await waitFor(() => {
      const transcript = screen.getByText(/全文/i);
      console.log('文字起こし結果:', transcript.textContent);
      expect(transcript).toBeInTheDocument();
    });

    await waitFor(() => {
      const highlight = screen.getByText(/キーワードハイライト/i);
      console.log('ハイライト結果:', highlight.textContent);
      expect(highlight).toBeInTheDocument();
    });
  });
});
