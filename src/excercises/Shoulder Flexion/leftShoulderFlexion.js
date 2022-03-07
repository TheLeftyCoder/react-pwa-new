let repsCompleted = 0;
let setsCompleted = 0;
let up = false,
  down = false;
let maxAngle = 10;
let dayRange = 0;
let maxAngleSum = 0;
// function checkForPerp(obj12, obj14, obj16) {
//   const vector1 = [(obj14.x - obj12.x) , (obj14.y - obj12.y)];
//   const vector2 = [(obj14.x - obj16.x) , (obj14.y - obj16.y)];

//   const dot = vector1[0]*vector2[0] + vector1[1]*vector2[1];

//   const mod_a = Math.sqrt(vector1[0]*vector1[0] + vector1[1]*vector1[1]);
//   const mod_b = Math.sqrt(vector2[0]*vector2[0] + vector2[1]*vector2[1]);

//   const elbowAngle = Math.round((Math.acos(dot/(mod_a*mod_b))*180)/3.14);

//   return elbowAngle;
// }

export default function leftShoulderFlexion(
  points,
  excerciseVars,
  setExcerciseVars
) {
  const { requiredReps } = excerciseVars;
  const obj12 = points[12];
  const obj14 = points[14];

  const vector1 = [obj12.x - obj12.x, obj12.y - obj12.y - 0.5];
  const vector2 = [obj12.x - obj14.x, obj12.y - obj14.y];

  const dot = vector1[0] * vector2[0] + vector1[1] * vector2[1];
  const mod_a = Math.sqrt(vector1[0] * vector1[0] + vector1[1] * vector1[1]);
  const mod_b = Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1]);

  const angle = ((Math.acos(dot / (mod_a * mod_b)) * 180) / 3.14).toFixed(2);
  maxAngle = Math.max(maxAngle, angle);

  if (angle <= 95) {
    down = true;
  } else if (angle >= 110) {
    up = true;
  }
  if (up === true && down === true) {
    repsCompleted += 1;
    up = false;
    down = false;
    if (repsCompleted % 2 === 0) {
      maxAngleSum += maxAngle;
      dayRange = (
        maxAngleSum /
        (repsCompleted / 2 + setsCompleted * requiredReps)
      ).toFixed(2);
      maxAngle = 10;
      setExcerciseVars({
        ...excerciseVars,
        repsCompleted: Math.ceil(repsCompleted / 2),
        setsCompleted,
        dayRange,
      });
    }
  }

  if (repsCompleted / 2 === requiredReps) {
    setsCompleted += 1;
    repsCompleted = 0;
    setExcerciseVars({
      ...excerciseVars,
      dayRange,
      repsCompleted,
      setsCompleted,
    });
  }
}
