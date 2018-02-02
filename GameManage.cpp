#include "GameManage.h"
#include <conio.h>
#include <windows.h>

void GameManage::Menu()
{
	char select;

	// �޴� ȭ�� ���
	cout << endl;
	cout << "   =============== �� �� ================" << endl;
	cout << "   |					|" << endl;
	cout << "   |		1. ���� ����		|" << endl;
	cout << "   |					|" << endl;
	cout << "   |		2. ����			|" << endl;
	cout << "   |					|" << endl;
	cout << "   ======================================" << endl << endl;

	while (1)
	{
		cout << "   ����: ";
		cin >> select;
		if (select != '1' && select != '2')
			cout << "   �߸��� �Է��Դϴ�. ���� �����̳� ���Ḧ �����Ͻʽÿ�" << endl << endl;
		else
			break;
	}

	if (select == '1')
		Start();	// ������ �����ϴ� Start �Լ� ȣ��
	else if (select == '2')
	{
		cout << "   ������ �����մϴ�." << endl;
		exit;
	}
}

void GameManage::Start()	// ������ ����
{
	system("cls");		// ȭ���� �����
	cout << "ù��° �÷��̾� ID �Է�: ";
	cin >> p1;
	cout << endl;

	cout << "�ι�° �÷��̾� ID �Է�: ";
	cin >> p2;

	Play();		// ������ �����ϴ� Play �Լ� ȣ��
}

void GameManage::Play()		// ������ ����
{
	system("cls");

	int x = 8, y = 8;		// Ŀ���� �ʱⰪ
	int c[2] = { x,y };
	MakeBoard(c);

	bool p1_turn = true;	// ù��° �÷��̾��� ���������� �Ǻ�

	while (1)
	{
		system("cls");
		DisplayBoard();		// ������ ���

		if (check_win_condition() == 1)
		{
			cout << "�ºΰ� �����ϴ�" << endl;
			cout << getp1() << " ��!!" << endl;
			break;
		}
		else if (check_win_condition() == 2)
		{
			cout << "�ºΰ� �����ϴ�" << endl;
			cout << getp2() << " ��!!" << endl;
			break;
		}

		if (p1_turn)	// ù��° �÷��̾� �����϶�
			cout << getp1() << "�� �����Դϴ�" << endl;
		else			// �ι�° �÷��̾� �����϶�
			cout << getp2() << "�� �����Դϴ�" << endl;
		cout << "( w: ��    a: ����    s: �Ʒ�    d: ������    space: �α�)" << endl;

		char arrow;
		arrow = _getch();		// ����� �Է�

		if (arrow == 'w')	// Ŀ�� ���� �̵�
		{
			if (x - 1 > -1)
			{
				board[x][y] = '+';
				x -= 1;
				board[x][y] = 'c';
				if (x + 1 == 17)
				{
					if (y == 0)
					{
						board[x + 1][y] = '3';
					}
					else if (y == 17)
					{
						board[x + 1][y] = '4';
					}
					else {
						board[x + 1][y] = 'u';
					}
				}
				else if (x<17 && y == 0)
				{
					board[x + 1][y] = 'r';
				}
				else if (x < 17 && y == 17)
				{
					board[x + 1][y] = 'l';
				}
			}

		}
		else if (arrow == 'a')	// Ŀ�� ���� �̵�
		{
			if (y - 1 > -1)
			{
				board[x][y] = '+';
				y -= 1;
				board[x][y] = 'c';
				if (y + 1 == 17)
				{
					if (x == 0)
					{
						board[x][y + 1] = '2';
					}
					else if (x == 17)
					{
						board[x][y + 1] = '4';
					}
					else {
						board[x][y + 1] = 'l';
					}
				}
				else if (y<17 && x == 0)
				{
					board[x][y + 1] = 'd';
				}
				else if (y < 17 && x == 17)
				{
					board[x][y + 1] = 'u';
				}
			}
		}
		else if (arrow == 's')	// Ŀ�� �Ʒ��� �̵�
		{
			if (x + 1 < 18)
			{
				board[x][y] = '+';
				x += 1;
				board[x][y] = 'c';
				if (x - 1 == 0)
				{
					if (y == 0) {
						board[x - 1][y] = '1';
					}
					else if (y == 17)
					{
						board[x - 1][y] = '2';
					}
					else {
						board[x - 1][y] = 'd';
					}
				}
				else if (x > 0 && y == 0)
				{
					board[x - 1][y] = 'r';
				}
				else if (x > 0 && y == 17)
				{
					board[x - 1][y] = 'l';
				}
			}
		}

		else if (arrow == 'd')		// Ŀ�� ������ �̵�
		{
			if (y + 1 < 18)
			{
				board[x][y] = '+';
				y += 1;
				board[x][y] = 'c';
				if (y - 1 == 0)
				{
					if (x == 0)
					{
						board[x][y - 1] = '1';
					}
					else if (x == 17)
					{
						board[x][y - 1] = '3';
					}
					else {
						board[x][y - 1] = 'r';
					}
				}
				else if (y > 0 && x == 0)
				{
					board[x][y - 1] = 'd';
				}
				else if (y > 0 && x == 17)
				{
					board[x][y - 1] = 'u';
				}
			}

		}
		else if (arrow == ' ')		// ������ �δ� ���
		{
			if (board[x][y] == 'b' || board[x][y] == 'w')	// �̹� ���� �����Ҷ�
			{
				cout << "�ش� ��ġ���� ���� �� �����ϴ�" << endl;
				Sleep(800);		// ���� �޽����� 0.8�ʵ��� ����
				system("cls");
				continue;		// �ݺ����� �ٽ� ����
			}

			if (p1_turn)	// ù��° �÷��̾� ������ ��
				stones_location[x][y] = 'b';		// ������ ��ġ ����
			else	// �ι�° �÷��̾� ������ ��
				stones_location[x][y] = 'w';	// �� �� ��ġ ����

			bool fill = false;		// 2�� for���� ���������� ���� ����
			for (int i = 0; i < 18; i++)
			{
				for (int j = 0; j < 18; j++)
					if (board[i][j] == '+')		// �� ���� �ΰ� ���� Ŀ���� ���� ���� ��ġ�� ���ġ
					{
						board[i][j] = 'c';
						x = i;
						y = j;
						fill = true;
						break;
					}
				if (fill)	// fill�� true�� 2�� for���� �������´�
					break;
			}
			p1_turn = !p1_turn;		// ���ʸ� �ٲ۴�
		}

		// ���� ���� ���� �����ǿ� ��ġ
		for (int i = 0; i < 18; i++)
			for (int j = 0; j < 18; j++)
			{
				if (stones_location[i][j] == 'b' || stones_location[i][j] == 'w')
					board[i][j] = stones_location[i][j];
			}
	}
}

int GameManage::check_win_condition()		// �ºΰ� ������ �Ǻ��ϴ� �Լ�
{

	// � �÷��̾ �̰������ ���� ������ ���� ����
	// (�ʱⰪ: 0, ù��° �÷��̾� �¸���: 1, �ι�° �÷��̾� �¸���: 2)
	int who_won = 0;

	for (int i = 0; i <= 17; i++)	// ���η� ������ �ϼ��Ǿ�����
	{
		for (int j = 0; j <= 13; j++)
		{
			if (board[i][j] == 'b' && board[i][j + 1] == 'b' &&		// ���� �̰��� ��
				board[i][j + 2] == 'b' && board[i][j + 3] == 'b' &&
				board[i][j + 4] == 'b')
				who_won = 1;
			else if (board[i][j] == 'w' && board[i][j + 1] == 'w' &&	// ���� �̰��� ��
				board[i][j + 2] == 'w' && board[i][j + 3] == 'w' &&
				board[i][j + 4] == 'w')
				who_won = 2;
		}
	}

	for (int i = 0; i <= 13; i++)	// ���η� ������ �ϼ��Ǿ�����
	{
		for (int j = 0; j <= 17; j++)
		{
			if (board[i][j] == 'b' && board[i + 1][j] == 'b' &&		// ���� �̰��� ��
				board[i + 2][j] == 'b' && board[i + 3][j] == 'b' &&
				board[i + 4][j] == 'b')
				who_won = 1;
			else if (board[i][j] == 'w' && board[i + 1][j] == 'w' &&	// ���� �̰��� ��
				board[i + 2][j] == 'w' && board[i + 3][j] == 'w' &&
				board[i + 4][j] == 'w')
				who_won = 2;
		}
	}

	for (int i = 0; i <= 13; i++)	// �밢������ ������ �ϼ��Ǿ����� ( �� ��� )
	{
		for (int j = 0; j <= 13; j++)
		{
			if (board[i][j] == 'b' && board[i + 1][j + 1] == 'b' &&		// ���� �̰��� ��
				board[i + 2][j + 2] == 'b' && board[i + 3][j + 3] == 'b' &&
				board[i + 4][j + 4] == 'b')
				who_won = 1;
			else if (board[i][j] == 'w' && board[i + 1][j + 1] == 'w' &&	// ���� �̰��� ��
				board[i + 2][j + 2] == 'w' && board[i + 3][j + 3] == 'w' &&
				board[i + 4][j + 4] == 'w')
				who_won = 2;
		}
	}

	for (int i = 0; i <= 13; i++)	// �밢������ ������ �ϼ��Ǿ����� ( / ��� )
	{
		for (int j = 4; j <= 17; j++)
		{
			if (board[i][j] == 'b' && board[i + 1][j - 1] == 'b' &&		// ���� �̰��� ��
				board[i + 2][j - 2] == 'b' && board[i + 3][j - 3] == 'b' &&
				board[i + 4][j - 4] == 'b')
				who_won = 1;
			else if (board[i][j] == 'w' && board[i + 1][j - 1] == 'w' &&	// ���� �̰��� ��
				board[i + 2][j - 2] == 'w' && board[i + 3][j - 3] == 'w' &&
				board[i + 4][j - 4] == 'w')
				who_won = 2;
		}
	}

	return who_won;
}