#include "GameManage.h"
#include <conio.h>
#include <windows.h>

void GameManage::Menu()
{
	char select;

	// 메뉴 화면 출력
	cout << endl;
	cout << "   =============== 오 목 ================" << endl;
	cout << "   |					|" << endl;
	cout << "   |		1. 게임 시작		|" << endl;
	cout << "   |					|" << endl;
	cout << "   |		2. 종료			|" << endl;
	cout << "   |					|" << endl;
	cout << "   ======================================" << endl << endl;

	while (1)
	{
		cout << "   선택: ";
		cin >> select;
		if (select != '1' && select != '2')
			cout << "   잘못된 입력입니다. 게임 시작이나 종료를 선택하십시오" << endl << endl;
		else
			break;
	}

	if (select == '1')
		Start();	// 게임을 시작하는 Start 함수 호출
	else if (select == '2')
	{
		cout << "   게임을 종료합니다." << endl;
		exit;
	}
}

void GameManage::Start()	// 게임을 시작
{
	system("cls");		// 화면을 지운다
	cout << "첫번째 플레이어 ID 입력: ";
	cin >> p1;
	cout << endl;

	cout << "두번째 플레이어 ID 입력: ";
	cin >> p2;

	Play();		// 게임을 진행하는 Play 함수 호출
}

void GameManage::Play()		// 게임을 진행
{
	system("cls");

	int x = 8, y = 8;		// 커서의 초기값
	int c[2] = { x,y };
	MakeBoard(c);

	bool p1_turn = true;	// 첫번째 플레이어의 차례인지를 판별

	while (1)
	{
		system("cls");
		DisplayBoard();		// 보드판 출력

		if (check_win_condition() == 1)
		{
			cout << "승부가 났습니다" << endl;
			cout << getp1() << " 승!!" << endl;
			break;
		}
		else if (check_win_condition() == 2)
		{
			cout << "승부가 났습니다" << endl;
			cout << getp2() << " 승!!" << endl;
			break;
		}

		if (p1_turn)	// 첫번째 플레이어 차례일때
			cout << getp1() << "의 차례입니다" << endl;
		else			// 두번째 플레이어 차례일때
			cout << getp2() << "의 차례입니다" << endl;
		cout << "( w: 위    a: 왼쪽    s: 아래    d: 오른쪽    space: 두기)" << endl;

		char arrow;
		arrow = _getch();		// 사용자 입력

		if (arrow == 'w')	// 커서 위로 이동
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
		else if (arrow == 'a')	// 커서 왼쪽 이동
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
		else if (arrow == 's')	// 커서 아래로 이동
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

		else if (arrow == 'd')		// 커서 오른쪽 이동
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
		else if (arrow == ' ')		// 오목돌을 두는 경우
		{
			if (board[x][y] == 'b' || board[x][y] == 'w')	// 이미 돌이 존재할때
			{
				cout << "해당 위치에는 놓을 수 없습니다" << endl;
				Sleep(800);		// 위의 메시지를 0.8초동안 띄운다
				system("cls");
				continue;		// 반복문을 다시 돈다
			}

			if (p1_turn)	// 첫번째 플레이어 차례일 때
				stones_location[x][y] = 'b';		// 검은돌 위치 저장
			else	// 두번째 플레이어 차례일 때
				stones_location[x][y] = 'w';	// 흰 돌 위치 저장

			bool fill = false;		// 2중 for문을 빠져나오기 위한 변수
			for (int i = 0; i < 18; i++)
			{
				for (int j = 0; j < 18; j++)
					if (board[i][j] == '+')		// 한 수를 두고 나면 커서는 돌이 없는 위치에 재배치
					{
						board[i][j] = 'c';
						x = i;
						y = j;
						fill = true;
						break;
					}
				if (fill)	// fill이 true면 2중 for문을 빠져나온다
					break;
			}
			p1_turn = !p1_turn;		// 차례를 바꾼다
		}

		// 검은 돌과 흰돌을 오목판에 배치
		for (int i = 0; i < 18; i++)
			for (int j = 0; j < 18; j++)
			{
				if (stones_location[i][j] == 'b' || stones_location[i][j] == 'w')
					board[i][j] = stones_location[i][j];
			}
	}
}

int GameManage::check_win_condition()		// 승부가 낫는지 판별하는 함수
{

	// 어떤 플레이어가 이겼는지에 대한 정보를 담을 변수
	// (초기값: 0, 첫번째 플레이어 승리시: 1, 두번째 플레이어 승리시: 2)
	int who_won = 0;

	for (int i = 0; i <= 17; i++)	// 가로로 오목이 완성되었을때
	{
		for (int j = 0; j <= 13; j++)
		{
			if (board[i][j] == 'b' && board[i][j + 1] == 'b' &&		// 흑이 이겼을 때
				board[i][j + 2] == 'b' && board[i][j + 3] == 'b' &&
				board[i][j + 4] == 'b')
				who_won = 1;
			else if (board[i][j] == 'w' && board[i][j + 1] == 'w' &&	// 백이 이겼을 때
				board[i][j + 2] == 'w' && board[i][j + 3] == 'w' &&
				board[i][j + 4] == 'w')
				who_won = 2;
		}
	}

	for (int i = 0; i <= 13; i++)	// 세로로 오목이 완성되었을때
	{
		for (int j = 0; j <= 17; j++)
		{
			if (board[i][j] == 'b' && board[i + 1][j] == 'b' &&		// 흑이 이겼을 때
				board[i + 2][j] == 'b' && board[i + 3][j] == 'b' &&
				board[i + 4][j] == 'b')
				who_won = 1;
			else if (board[i][j] == 'w' && board[i + 1][j] == 'w' &&	// 백이 이겼을 때
				board[i + 2][j] == 'w' && board[i + 3][j] == 'w' &&
				board[i + 4][j] == 'w')
				who_won = 2;
		}
	}

	for (int i = 0; i <= 13; i++)	// 대각선으로 오목이 완성되었을때 ( ＼ 모양 )
	{
		for (int j = 0; j <= 13; j++)
		{
			if (board[i][j] == 'b' && board[i + 1][j + 1] == 'b' &&		// 흑이 이겼을 때
				board[i + 2][j + 2] == 'b' && board[i + 3][j + 3] == 'b' &&
				board[i + 4][j + 4] == 'b')
				who_won = 1;
			else if (board[i][j] == 'w' && board[i + 1][j + 1] == 'w' &&	// 백이 이겼을 때
				board[i + 2][j + 2] == 'w' && board[i + 3][j + 3] == 'w' &&
				board[i + 4][j + 4] == 'w')
				who_won = 2;
		}
	}

	for (int i = 0; i <= 13; i++)	// 대각선으로 오목이 완성되었을때 ( / 모양 )
	{
		for (int j = 4; j <= 17; j++)
		{
			if (board[i][j] == 'b' && board[i + 1][j - 1] == 'b' &&		// 흑이 이겼을 때
				board[i + 2][j - 2] == 'b' && board[i + 3][j - 3] == 'b' &&
				board[i + 4][j - 4] == 'b')
				who_won = 1;
			else if (board[i][j] == 'w' && board[i + 1][j - 1] == 'w' &&	// 백이 이겼을 때
				board[i + 2][j - 2] == 'w' && board[i + 3][j - 3] == 'w' &&
				board[i + 4][j - 4] == 'w')
				who_won = 2;
		}
	}

	return who_won;
}