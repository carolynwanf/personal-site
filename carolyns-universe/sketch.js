graphView = false;
personToGraph = null;
bars = [];

colors = {
  me: "#fabe4d", // yellow
  college: "#c47951", // mercury
  family: "#dcb87a", // venus
  highSchoolNewYork: "#df664c", // mars
  highSchoolNewMexico: "#54b583", // green
  sistersFriends: "#55bfbf", // teal
  summerFriends: "#c8c1aa", // saturn
  HSteachers: "#5783de", // neptune
  background: "#231f20",
  orbit: "#33332F",
};

function preload() {
  photosData = loadJSON("../resources/photosByPeople.json");
  montserratAltBold = loadFont("../resources/MontserratAlternates-Bold.otf");
  montserratAltLight = loadFont("../resources/MontserratAlternates-Light.otf");
  montserratAltReg = loadFont("../resources/MontserratAlternates-Regular.otf");
  nasalization = loadFont("../resources/nasalization-rg.otf");

  fonts = {
    labels: {
      font: montserratAltBold,
      spacing: "0.5px",
      sizeSmall: 14,
      sizeMed: 16,
      sizeLarge: 24,
      color: "#FFF8C7",
    },
    title: {
      font: nasalization,
      spacing: "2px",
      size: 50,
      color: "#cfc7b0",
    },
    legend: {
      font: montserratAltReg,
      size: 16,
      color: "#cfc7b0",
    },
  };
}

function setup() {
  w = 1750;
  h = windowHeight;
  cx = w / 2 + 300;
  cy = h / 2;
  createCanvas(w - 400, h);
  background(fonts.labels.color);
  angleMode(DEGREES);
  cursor("../resources/cursor.png");

  // back button
  backButton = new BackButton(0, 0, 0);

  categories = {};

  rings = [350, 400, 450, 500, 550, 600, 650];

  let peopleLoc = {
    me: new Point(0, 0),
    college: new Point(int(cos(270) * rings[0]), int(sin(270) * rings[0])),
    family: new Point(int(cos(155) * rings[1]), int(sin(155) * rings[1])),
    highSchoolNewMexico: new Point(
      int(cos(215) * rings[2]),
      int(sin(215) * rings[2])
    ),
    highSchoolNewYork: new Point(
      int(cos(125) * rings[3]),
      int(sin(125) * rings[3])
    ),
    summerFriends: new Point(
      int(cos(170) * rings[4]),
      int(sin(170) * rings[4])
    ),
    sistersFriends: new Point(
      int(cos(190) * rings[5]),
      int(sin(190) * rings[5])
    ),
    HSteachers: new Point(int(cos(220) * rings[6]), int(sin(220) * rings[6])),
  };

  // Sort people by category
  for (let [person, personInfo] of Object.entries(photosData)) {
    if (!(personInfo.category in categories)) {
      categories[personInfo.category] = [];
    }

    categories[personInfo.category].push(
      new Circle(
        person,
        personInfo.totalPhotos,
        personInfo.category,
        personInfo.photos
      )
    );
  }

  // Sort people in each category by number of photos
  for (let [category, people] of Object.entries(categories)) {
    people.sort(function (person1, person2) {
      return person2.totalPhotos - person1.totalPhotos;
    });

    // Setting person of each list
    people[0].x = peopleLoc[category].x;
    people[0].y = peopleLoc[category].y;
    people[0].computed = true;
    people[0].largest = true;
  }

  // Computing positions
  for (const [category, people] of Object.entries(categories)) {
    let centerX = peopleLoc[category].x;
    let centerY = peopleLoc[category].y;
    for (let person of people) {
      person.computePosition(people, centerX, centerY);
    }
  }
}

function draw() {
  background(fonts.legend.color);
  fill(colors.background);
  rect(0, 0, w, h);

  // Legend
  let legendStartX = 50;
  let legendStartY = h / 11;
  textFont(fonts.title.font);
  textAlign(LEFT);

  // Categories
  let categoriesY = legendStartY + 2 * fonts.title.size + 20;
  textFont("Helvetica");
  textSize(fonts.legend.size + 6);
  fill(fonts.legend.color);
  text("How we met:", legendStartX, categoriesY);
  textSize(fonts.legend.size);
  categoriesY += 34;
  drawLegendItem(
    colors.me,
    "it's me, Carolyn!",
    legendStartX + 10,
    categoriesY,
    1
  );
  categoriesY += 40;
  drawLegendItem(colors.college, "college", legendStartX + 10, categoriesY, 2);
  categoriesY += 40;
  drawLegendItem(colors.family, "family", legendStartX + 10, categoriesY, 3);
  categoriesY += 40;
  drawLegendItem(
    colors.highSchoolNewMexico,
    "school in New Mexico",
    legendStartX + 10,
    categoriesY,
    4
  );
  categoriesY += 40;
  drawLegendItem(
    colors.highSchoolNewYork,
    "school in New York",
    legendStartX + 10,
    categoriesY,
    5
  );
  categoriesY += 40;
  drawLegendItem(
    colors.summerFriends,
    "over the summer",
    legendStartX + 10,
    categoriesY,
    6
  );
  categoriesY += 40;
  drawLegendItem(
    colors.sistersFriends,
    "friends of my sister",
    legendStartX + 10,
    categoriesY,
    7
  );
  categoriesY += 40;
  drawLegendItem(
    colors.HSteachers,
    "high school teachers",
    legendStartX + 10,
    categoriesY,
    8
  );

  // Planets view
  if (graphView === false) {
    // Area key
    push();
    textFont(fonts.title.font);
    textSize(fonts.title.size);
    fill(fonts.title.color);
    textAlign(LEFT);
    text("Carolyn's Universe", legendStartX, legendStartY);
    text("in photos", legendStartX, legendStartY + fonts.title.size + 10);
    pop();
    categoriesY += 120;
    let baseRadius = 5 * sqrt(500 / PI);
    stroke(fonts.legend.color);
    strokeWeight(2);
    noFill();
    circle(legendStartX + 10 + baseRadius, categoriesY, 2 * baseRadius);
    circle(
      legendStartX + 10 + baseRadius,
      categoriesY + 15,
      2 * baseRadius - 30
    );
    circle(
      legendStartX + 10 + baseRadius,
      categoriesY + 30,
      2 * baseRadius - 60
    );
    circle(
      legendStartX + 10 + baseRadius,
      categoriesY + 45,
      2 * baseRadius - 90
    );

    let lineStartX = legendStartX + 20 + 2 * baseRadius;
    line(
      lineStartX,
      categoriesY - baseRadius,
      lineStartX + 30,
      categoriesY - baseRadius
    );
    line(
      lineStartX + 15,
      categoriesY - baseRadius,
      lineStartX + 15,
      categoriesY + baseRadius
    );
    line(
      lineStartX,
      categoriesY + baseRadius,
      lineStartX + 30,
      categoriesY + baseRadius
    );
    noStroke();
    fill(fonts.legend.color);
    text("500 photos", lineStartX + 35, categoriesY - 4);

    translate(cx, cy);

    // Drawing orbits
    for (let i = 0; i < rings.length; i++) {
      let ringVal = rings[i];
      let orbitColor;
      if (i === 0) {
        orbitColor = color(colors.college);
      } else if (i === 1) {
        orbitColor = color(colors.family);
      } else if (i === 2) {
        orbitColor = color(colors.highSchoolNewMexico);
      } else if (i === 3) {
        orbitColor = color(colors.highSchoolNewYork);
      } else if (i === 4) {
        orbitColor = color(colors.summerFriends);
      } else if (i === 5) {
        orbitColor = color(colors.sistersFriends);
      } else if (i === 6) {
        orbitColor = color(colors.HSteachers);
      }

      orbitColor.setAlpha(70);
      stroke(orbitColor);
      noFill();

      circle(0, 0, ringVal * 2);

      fill(fonts.legend.color);
      textFont(fonts.labels.font);
      textSize(fonts.labels.sizeMed);
      textAlign(CENTER);
      text(i + 2, -ringVal, 0);
      noStroke();
    }
    // Displaying people
    for (const [category, people] of Object.entries(categories)) {
      for (let person of people) {
        person.display();
      }
    }

    // Graph view
  } else {
    // Draw overlay
    let overlay = color(colors.background);
    overlay.setAlpha(180);
    fill(overlay);
    rect(0, 0, w, h);

    // Legend
    let legendStartX = 50;
    let legendStartY = h / 11;

    // Title
    textFont(fonts.title.font);
    textSize(fonts.title.size);
    fill(fonts.title.color);
    textAlign(LEFT);
    text(personToGraph.firstName + "'s photos", legendStartX, legendStartY);
    text("over time", legendStartX, legendStartY + fonts.title.size + 10);

    // Only draw category that is represented
    let categoriesY = legendStartY + 2 * fonts.title.size + 20;
    textFont("Helvetica");
    textSize(fonts.legend.size + 6);
    fill(fonts.legend.color);
    text("How we met:", legendStartX, categoriesY);

    textSize(fonts.legend.size);
    categoriesY += 34;
    push();
    if (personToGraph.category === "me") {
      drawLegendItem(
        colors.me,
        "it's me, Carolyn!",
        legendStartX + 10,
        categoriesY,
        1
      );
    } else if (personToGraph.category === "college") {
      categoriesY += 40;
      drawLegendItem(
        colors.college,
        "college",
        legendStartX + 10,
        categoriesY,
        2
      );
    } else if (personToGraph.category === "family") {
      categoriesY += 2 * 40;
      drawLegendItem(
        colors.family,
        "family",
        legendStartX + 10,
        categoriesY,
        3
      );
    } else if (personToGraph.category === "highSchoolNewMexico") {
      categoriesY += 3 * 40;
      drawLegendItem(
        colors.highSchoolNewMexico,
        "school in New Mexico",
        legendStartX + 10,
        categoriesY,
        4
      );
    } else if (personToGraph.category === "highSchoolNewYork") {
      categoriesY += 4 * 40;
      drawLegendItem(
        colors.highSchoolNewYork,
        "school in New York",
        legendStartX + 10,
        categoriesY,
        5
      );
    } else if (personToGraph.category === "summerFriends") {
      categoriesY += 5 * 40;
      drawLegendItem(
        colors.summerFriends,
        "over the summer",
        legendStartX + 10,
        categoriesY,
        6
      );
    } else if (personToGraph.category === "sistersFriends") {
      categoriesY += 6 * 40;
      drawLegendItem(
        colors.sistersFriends,
        "friends of my sister",
        legendStartX + 10,
        categoriesY,
        7
      );
    } else if (personToGraph.category === "HSteachers") {
      categoriesY += 7 * 40;
      drawLegendItem(
        colors.HSteachers,
        "high school teachers",
        legendStartX + 10,
        categoriesY,
        8
      );
    }
    pop();

    // Back button
    categoriesY = legendStartY + 2 * fonts.title.size + 20 + 34 + 40 * 10;
    let baseRadius = 5 * sqrt(500 / PI);
    noStroke();
    fill(fonts.legend.color);
    backButton = new BackButton(
      legendStartX + 10 + baseRadius,
      categoriesY,
      baseRadius
    );
    push();
    if (backButton.over(mouseX, mouseY)) {
      let c = color(fonts.legend.color);
      c.setAlpha(100);
      stroke(c);
      strokeWeight(20);
    }
    circle(backButton.x, backButton.y, 2 * backButton.radius);
    noFill();
    stroke(colors.orbit);
    strokeWeight(2);
    translate(backButton.x + 5, backButton.y - 3);
    rotate(20);
    circle(-20, -6, 10);
    circle(0, -13, 30);
    circle(-15, 15, 30);
    circle(12, 12, 24);
    pop();

    // Draw axes
    translate(cx - 800, cy + 250);
    stroke(colors.orbit);
    let binWidth = 30;
    let binMargin = 7;
    let bins = 22;
    line(0, 0, bins * (binWidth + binMargin) + binMargin, 0);

    // Draw bins
    let drawX = binMargin;
    let drawY = 0;
    noStroke();
    for (let i = 1; i < bins + 1; i++) {
      let year = 2000 + i;
      year.toString();
      if (year in personToGraph.photos) {
        let photoBarHeight =
          ((personToGraph.photos[year].length / 835) * 835) / 1.2;
        // add to bars
        let bar = new Bar(
          cx - 800 + drawX,
          cx - 800 + drawX + binWidth,
          cy + 250 - photoBarHeight,
          cy + 250,
          personToGraph.photos[year].length
        );
        bars.push(bar);
        //draw bars
        fill(personToGraph.color);
        rect(
          drawX,
          drawY - photoBarHeight,
          binWidth,
          photoBarHeight,
          7,
          7,
          0,
          0
        );
        fill(fonts.legend.color);
        // display num
        if (bar.over(mouseX, mouseY)) {
          textAlign(CENTER);
          text(
            personToGraph.photos[year].length,
            drawX + binWidth / 2,
            drawY - photoBarHeight - 12
          );
        }
        textAlign(LEFT);
        // Years
        push();
        translate(drawX - 75, 0);
        rotate(-60);
        text(year, 0, drawY + 90);
        pop();
      }

      let annotation = false;
      let annotationText = "";
      let yOffset = 110;

      if (year == "2001") {
        annotation = true;
        annotationText = "I'm born :)";
      } else if (year == "2013") {
        annotation = true;
        annotationText = "move to New York";
      } else if (year == "2017") {
        annotation = true;
        annotationText = "move to New Mexico and summer at Stanford";
        yOffset = 170;
      } else if (year == "2019") {
        annotation = true;
        annotationText = "started college";
      } else if (year == "2022") {
        annotation = true;
        annotationText = "summer in California";
        yOffset = 140;
      }

      // console.log(annotation)
      push();
      if (annotation) {
        circle(100, 500, 40);
        push();
        translate(drawX - 75, 0);
        rotate(-60);
        text(year, 0, drawY + 90);
        pop();
        stroke(fonts.legend.color);
        line(drawX, drawY + yOffset - 25, drawX, drawY + 55);
        noStroke();
        textAlign(CENTER);
        text(annotationText, drawX, drawY + yOffset);
      }
      pop();

      drawX += binWidth + binMargin;
    }
    // top 2*fonts.title.size+20

    // Label axes
    // Draw
  }
}

function drawLegendItem(color, item, x, y, num) {
  fill(fonts.legend.color);
  text(num, x, y + 6);
  fill(color);
  circle(x + 30, y, 25);
  fill(fonts.legend.color);
  text(item, x + 55, y + 6);
}

function mouseClicked() {
  for (let [category, people] of Object.entries(categories)) {
    for (let person of people) {
      if (person.over(mouseX - cx, mouseY - cy)) {
        graphView = true;
        personToGraph = person;
      }
    }
  }

  if (dist(mouseX, mouseY, backButton.x, backButton.y) < backButton.radius) {
    graphView = false;
    personToGraph = null;
    bars = [];
  }
}

class BackButton {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  over(x, y) {
    if (dist(this.x, this.y, x, y) < this.radius) {
      return true;
    }

    return false;
  }
}
class Bar {
  constructor(left, right, top, bottom, photos) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.photos = photos;
  }

  over(x, y) {
    if (
      x > this.left &&
      x < this.right &&
      y < this.bottom &&
      y > this.top - 15
    ) {
      return true;
    }

    return false;
  }

  displayNum() {
    fill(fonts.legend.color);
    text(this.photos, this.top, this.left);
  }
}

class Circle {
  constructor(name, totalPhotos, category, photos) {
    [this.firstName, this.lastName] = name.split(" ");
    this.totalPhotos = totalPhotos;
    this.category = category;
    this.largest = false;
    this.radius = 5 * sqrt(totalPhotos / PI);
    this.photos = photos;

    this.assignColor();
  }

  assignColor() {
    switch (this.category) {
      case "me":
        this.color = colors.me;
        break;
      case "college":
        this.color = colors.college;
        break;
      case "family":
        this.color = colors.family;
        break;
      case "highSchoolNewYork":
        this.color = colors.highSchoolNewYork;
        break;
      case "highSchoolNewMexico":
        this.color = colors.highSchoolNewMexico;
        break;
      case "sistersFriends":
        this.color = colors.sistersFriends;
        break;
      case "summerFriends":
        this.color = colors.summerFriends;
        break;
      case "HSteachers":
        this.color = colors.HSteachers;
        break;
    }
  }

  computePosition(c, cx, cy) {
    let openPoints = [];
    let pnt;

    // skip if computed already
    if (this.computed) {
      return;
    }

    // for each circle
    for (let i = 0; i < c.length; i++) {
      // if computed
      if (c[i].computed) {
        // for each possible angle
        for (let ang = 0; ang < 360; ang++) {
          let collision = false;
          pnt = new Point();
          pnt.x = c[i].x + int(cos(ang) * (this.radius + c[i].radius + 1));
          pnt.y = c[i].y + int(sin(ang) * (this.radius + c[i].radius + 1));

          for (let j = 0; j < c.length; j++) {
            if (c[j].computed && !collision) {
              if (
                dist(pnt.x, pnt.y, c[j].x, c[j].y) <
                this.radius + c[j].radius
              ) {
                collision = true;
              }
            }
          }

          if (!collision) {
            openPoints.push(pnt);
          }
        }
      }
    }

    let min_dist = -1;
    let best_point = 0;
    for (let i = 0; i < openPoints.length; i++) {
      if (
        min_dist == -1 ||
        dist(cx, cy, openPoints[i].x, openPoints[i].y) < min_dist
      ) {
        best_point = i;
        min_dist = dist(cx, cy, openPoints[i].x, openPoints[i].y);
      }
    }
    if (openPoints.length == 0) {
      // print("no points?");
    } else {
      // print(openPoints.length + " points");
      this.x = openPoints[best_point].x;
      this.y = openPoints[best_point].y;
    }

    this.computed = true;
  }

  display() {
    ellipseMode(CENTER);

    if (this.category === "me") {
      fill(fonts.legend.color);
      textFont(fonts.labels.font);
      textSize(fonts.labels.sizeMed);
      textAlign(CENTER);
      text(1, -this.radius - 25, 0);
    }

    // Draw circle
    let c = color(this.color);
    if (!this.largest) {
      c.setAlpha(150);
    }
    fill(color(c));

    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);

    // Display developer name of building
    if (this.radius > 25 || this.over(mouseX - cx, mouseY - cy)) {
      push();

      let buffer;
      select("canvas").elt.style.letterSpacing = "1px";
      if (this.radius > 60) {
        textSize(fonts.labels.sizeLarge);
        buffer = fonts.labels.sizeLarge;
      } else if (this.radius > 35) {
        textSize(fonts.labels.sizeMed);
        buffer = fonts.labels.sizeMed;
      } else {
        textSize(fonts.labels.sizeSmall);
        buffer = fonts.labels.sizeSmall;
      }
      textAlign(CENTER);
      if (this.over(mouseX - cx, mouseY - cy)) {
        c.setAlpha(100);
        stroke(c);
        strokeWeight(this.radius / 4);
        noFill();
        circle(this.x, this.y, this.radius * 2);
      }

      noStroke();

      textFont(fonts.labels.font);
      let shadow = color(colors.background);
      shadow.setAlpha(100);
      fill(shadow);
      text(this.firstName, this.x, this.y + 2);

      fill("#FFF8C7");
      text(this.firstName, this.x, this.y);
      textSize(buffer - 2);
      text(this.totalPhotos, this.x, this.y + buffer / 4 + buffer);

      pop();
    }
    noStroke();
  }

  over(x, y) {
    if (dist(this.x, this.y, x, y) < this.radius) {
      return true;
    } else if (
      dist(this.x, this.y, x, y) < this.radius + 3 &&
      this.radius < 12
    ) {
      return true;
    }

    return false;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
