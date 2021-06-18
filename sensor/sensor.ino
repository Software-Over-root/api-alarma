int TRIG = 10;
int ECO = 9;
int LED = 3;
int DURACION;
int DISTANCIA;

void setup() {
  // put your setup code here, to run once:
  pinMode(TRIG, OUTPUT);
  pinMode(ECO, INPUT);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(TRIG, HIGH);
  delay(1);
  digitalWrite(TRIG, LOW);
  DURACION = pulseIn(ECO, HIGH);
  DISTANCIA = DURACION / 58.2;
  Serial.println(DISTANCIA);
  delay(200);

  if(DISTANCIA <= 20 && DISTANCIA >= 0){
    digitalWrite(LED, HIGH);
    delay(DISTANCIA * 10);
    digitalWrite(LED, LOW);
  }
}
