# pulsenics

Files:
Mostly everything I did was in App.tsx and CurveController.cs using a react ASP.net template

The whole thing can be done in the frontend, but I have a backend call to show some communication between the frontend and backend.
The call takes in the points, type and then returns the equation.

In this case, the frontend handles validation of data, and the backend does some validation as well.

EXAMPLE POINTS:
0,1;1,2;3,6;7,30;5,15;4,3;-5,1;  --> showcase negative
0,1;1,2;3.5,6;7,30;5.2,15;4,3;-5,1; --> showcase decimals
0,2; -> what happens when not enough points
0,0;1,1;2,2;3,3; -> linear
0,0;1,1;2,4;3,9; -> quadratic
0,0;1,1;2,8;3,27; -> cubic
3,1;2,4;5,4;7,1;0,10; -> out of order points

DEMO VIDEO:
https://youtu.be/9VFpAHcUEuQ (2 mins)