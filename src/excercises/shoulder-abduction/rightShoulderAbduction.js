let repsCompleted = 0;
let setsCompleted = 0;
let up = false,
  down = false;
let maxAngle = 10;
let maxAngleSum = 0;
let dayRange = 0;
let calibrationAngle = 0;
let t0, t1;
let tc0, tc1, calibratedTime; // tc --> time_calibration stamp
let flag = 0;

function speak_js(message) {
  var msg = new SpeechSynthesisUtterance(message);
  window.speechSynthesis.speak(msg);
}

export default function rightShoulderAbduction(
  points,
  excerciseVars,
  setExcerciseVars
) {
  const { requiredReps } = excerciseVars;
  const obj11 = points[11];
  const obj13 = points[13];
  const vector1 = [obj11.x - obj11.x, obj11.y - obj11.y - 0.3];
  const vector2 = [obj11.x - obj13.x, obj11.y - obj13.y];
  const dot = vector1[0] * vector2[0] + vector1[1] * vector2[1];
  const mod_a = Math.sqrt(vector1[0] * vector1[0] + vector1[1] * vector1[1]);
  const mod_b = Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1]);
  const angle = ((Math.acos(dot / (mod_a * mod_b)) * 180) / 3.14).toFixed(2);
  maxAngle = Math.max(maxAngle, angle);

  if (flag === 0) {
    speak_js(
      "Stretch your arms to the maximum possible as this set helps us to calibrate"
    );
    flag = 1;
  }

  if (angle <= 30) {
    down = true;
    if (up === false && setsCompleted === 0)
      tc0 = new Date().getSeconds() + new Date().getMinutes() * 60;
    if (up === false)
      t0 = new Date().getSeconds() + new Date().getMinutes() * 60;
  } else if (
    angle >= (setsCompleted === 0 ? 40 : calibrationAngle / requiredReps)
  ) {
    up = true;
    console.log(
      "calibrated angle = ",
      (setsCompleted === 0 ? 40 : calibrationAngle / requiredReps) +
        " angle " +
        angle
    );
    // console.log(
    //   "The calibrated time is = ",
    //   calibratedTime + " setsCompleted " + setsCompleted
    // );
  }
  if (up === true && down === true) {
    repsCompleted += 1;
    up = false;
    down = false;

    if (repsCompleted % 2 === 0) {
      speak_js(
        (repsCompleted / 2).toString() +
          "reps" +
          setsCompleted.toString() +
          "sets"
      );

      if (setsCompleted === 0) {
        tc1 = new Date().getSeconds() + new Date().getMinutes() * 60;
        calibratedTime += tc1 - tc0;
      }
      t1 = new Date().getSeconds() + new Date().getMinutes() * 60;
      // console.log(t0 + " " + t1);
      // if (
      //   setsCompleted !== 0 &&
      //   (t1 - t0 > (setsCompleted === 0)
      //     ? 30
      //     : calibratedTime / requiredReps + 6)
      // ) {
      //   speak_js("Too slow");
      // }
      if (
        setsCompleted !== 0 &&
        t1 - t0 > (setsCompleted === 0 ? 30 : calibratedTime / requiredReps + 6)
      ) {
        speak_js("Too slow");
      }
      window.t0 = t1;

      maxAngleSum += maxAngle;
      dayRange = (
        maxAngleSum /
        (repsCompleted / 2 + setsCompleted * requiredReps)
      ).toFixed(2);
      calibrationAngle += setsCompleted === 0 ? maxAngle : 0;
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
