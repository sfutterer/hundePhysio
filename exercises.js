/**
 * Übungsdaten. Grundlage sind die Handzettel des AniCura Kleintierzentrums
 * Weingarten. Ergänzungen aus eigener Recherche stehen getrennt im Feld
 * "recherche" und sind in der App auch so gekennzeichnet.
 */
const UEBUNGEN = [
  {
    id: 'erhoeht-stehen',
    titel: 'Erhöht stehen',
    kurz: 'Vorder- oder Hinterpfoten auf eine Stufe – verlagert das Gewicht gezielt auf ein Beinpaar.',
    frequenz: '1–3 × täglich · 3–5 Wiederholungen',
    ziel: [
      'Fördert die Gliedmaßenbelastung',
      'Erhaltung und Förderung von Kraft und Ausdauer',
      'Balance und Propriozeption',
    ],
    material: 'Stabile Stufe oder Podest, rutschfeste Unterlage, Leckerlis',
    ablauf: [
      'Rutschfesten Untergrund vorbereiten – Teppich, Yoga- oder Gummimatte. Auf glattem Boden rutschen die Pfoten weg und die Übung wird unsauber.',
      'Den Hund im Schritt an die Stufe führen und selbst hinaufsteigen lassen, notfalls mit einem Leckerli locken. Nicht hochheben.',
      'Position prüfen: Rücken gerade, Beine parallel unter dem Körper, Gewicht gleichmäßig auf beiden Seiten. Kein Durchhängen, kein seitliches Ausstellen.',
      'Position ruhig halten und über ein Leckerli auf Nasenhöhe stabilisieren.',
      'Sanft mit der flachen Hand an Schulter oder Becken schieben, um das Gewicht zu verlagern – nur so viel, dass der Hund gegenhält, ohne einen Schritt zu machen.',
      'Kontrolliert heruntersteigen lassen, kurz Pause, dann die nächste Wiederholung.',
    ],
    bloecke: [
      {
        name: 'Anfänger',
        punkte: [
          'Vorne bzw. hinten erhöht stehen',
          'Sanft schieben, um das Gewicht zu verlagern',
          'Gewichtsverlagerung durch Leckerli',
        ],
      },
      {
        name: 'Fortgeschrittene',
        punkte: ['Mit Balancekissen', 'Anheben einer Gliedmaße', 'Kombination aus diesen Übungen'],
      },
      {
        name: 'Profis',
        punkte: ['Ist die Stufe lang genug, kann das seitliche Hoch- und Runtergehen geübt werden'],
      },
    ],
    achtung: [
      'Auf rutschfeste Oberfläche achten',
      'Hoch und runter im Schritt – nicht springen lassen',
      'Bei Zittern, Wegknicken oder starkem Hecheln abbrechen',
    ],
    recherche: [
      'Stufenhöhe: etwa Höhe des Handwurzel- bzw. Sprunggelenks, maximal Ellenbogenhöhe. Je höher die Stufe, desto größer die Belastung.',
      'Vorderpfoten erhöht bedeutet mehr Last auf der Hinterhand (Hüfte, Knie, Rückenmuskulatur). Hinterpfoten erhöht bedeutet mehr Last auf Schulter und Vorderhand.',
      'Haltedauer je Wiederholung etwa 10–30 Sekunden und langsam steigern.',
    ],
    videos: [
      { id: '04tJarUy-OU', titel: 'Front paws up / Hindend loading', kanal: 'Canine Rehab', sprache: 'EN' },
    ],
  },

  {
    id: 'prom',
    titel: 'Passives Bewegen (PROM)',
    kurz: 'Jedes Gelenk im schmerzfreien Bereich durchbewegen – im Liegen, ohne Mitarbeit des Hundes.',
    frequenz: '1 × täglich · je Gelenk ca. 10 × Beugung und 10 × Streckung',
    ziel: [
      'Erhält oder verbessert die Gelenkbeweglichkeit',
      'Regt die Bildung von Gelenkflüssigkeit an und nährt den Knorpel',
      'Wirkt schmerzlindernd',
    ],
    material: 'Weiche Unterlage, ruhige Umgebung',
    ablauf: [
      'Der Hund soll sich wohlfühlen: entspannte Seitenlage auf weichem Untergrund. Erst beginnen, wenn er wirklich ruhig liegt.',
      'Gelenknah greifen: die obere Hand hält, die untere Hand bewegt.',
      'Jedes Gelenk einzeln behandeln.',
      'Das Gelenk über dem behandelten bleibt in Neutralstellung, also weder in Beugung noch in Streckung.',
      'Beim Sprunggelenk muss das Knie angewinkelt sein.',
      'Langsam und rhythmisch in fließenden Bewegungen arbeiten.',
      'Gut stützen, damit keine Scherkräfte wirken.',
    ],
    achtung: [
      'Die momentane ROM (Bewegungsausmaß) des Gelenks darf nicht überschritten werden',
      'Der Hund darf keinesfalls Schmerzen bei der Behandlung haben',
    ],
    recherche: [
      'Reihenfolge von der Pfote nach oben: Vorderbein Zehen, Handwurzel (Karpus), Ellenbogen, Schulter. Hinterbein Zehen, Sprunggelenk, Knie, Hüfte.',
      'Tempo: rund 2 Sekunden in die Beugung, 2 Sekunden in die Streckung. Am Endpunkt kurz halten, nicht federn.',
      'Schmerzanzeichen sind leise: Anspannen, Kopf zur Hand drehen, Lecken, Gähnen, Wegziehen des Beins, angelegte Ohren. Dann sofort zurücknehmen.',
      'Großflächiges Fahrradfahren mit dem ganzen Bein ersetzt PROM nicht – dabei durchläuft kein Gelenk seinen vollen Bewegungsbereich.',
    ],
    videos: [
      {
        id: 'PYuB9_pGrhM',
        titel: 'How to do Passive Range of Movement Exercises in the Dog',
        kanal: 'Gatehouse Vet Rehab',
        sprache: 'EN',
      },
    ],
  },

  {
    id: 'transfers',
    titel: 'Sitz-Steh / Platz-Steh-Transfers',
    kurz: 'Aufstehen aus Sitz und Platz – Krafttraining für die Hinterhand.',
    frequenz: '3–5 × täglich · 3–5 Wiederholungen',
    ziel: [
      'Fördert die Gelenkbeweglichkeit',
      'Gleichmäßige Gliedmaßenbelastung',
      'Kräftigt die Muskulatur der Hinterbeine',
    ],
    material: 'Rutschfester Untergrund, Leckerlis, bei Bedarf eine Wand als Begrenzung',
    bloecke: [
      {
        name: 'Sitz-Steh-Übung',
        punkte: [
          'Auf gerades Sitzen achten: Hinterbeine gleichmäßig angewinkelt, nicht seitlich rausgeschoben.',
          'Vorderbeine bleiben stehen, der Hund drückt sich nur mit den Hinterbeinen hoch.',
          'Etwa 5 Sekunden sitzen bleiben, danach das Kommando Steh.',
          'Gegen das Ausstellen des Beins hilft es, den Hund neben einer Wand absitzen zu lassen – das betroffene Bein zur Wandseite.',
        ],
      },
      {
        name: 'Platz-Steh-Übung',
        punkte: [
          'Aus symmetrischer Position mit allen vier Gliedmaßen gleichmäßig hochdrücken.',
          'Über die Sitz-Position in den Stand kommen.',
          'Das Ziehen des Gewichts über die Vorderbeine vermeiden.',
        ],
      },
    ],
    recherche: [
      'Das Leckerli waagerecht vor der Nase führen, nicht nach oben – sonst zieht sich der Hund über die Vorderhand hoch.',
      'Nach dem Aufstehen 2–3 Sekunden im Stand stabilisieren, bevor das nächste Sitz kommt.',
      'Hochdrücken und Absetzen jeweils langsam ausführen. Schnelles Hochschnellen nutzt Schwung statt Muskelkraft.',
      'Auf glattem Boden gelingt sauberes Sitzen kaum – immer eine rutschfeste Unterlage verwenden.',
    ],
    videos: [
      {
        id: 'TywztB9jTQU',
        titel: 'Strengthening Exercises: Sit-stand and Down-sit',
        kanal: 'Gatehouse Vet Rehab',
        sprache: 'EN',
      },
    ],
  },

  {
    id: 'cavaletti',
    titel: 'Cavaletti-Training',
    kurz: 'Im langsamen Schritt über niedrige Stangen – sortiert die Pfoten und kräftigt gleichmäßig.',
    frequenz: '2–3 × täglich · je 3–5 Wiederholungen',
    ziel: [
      'Erhält und fördert die Gelenkbeweglichkeit',
      'Sorgt für die gleichmäßige Belastung aller vier Gliedmaßen',
      'Muskelkräftigung',
    ],
    material: 'Stangen, Besenstiele oder Pylonen mit auflegbaren Stangen',
    ablauf: [
      'Stangen in einer Reihe auslegen, alle in gleicher Höhe und mit gleichem Abstand.',
      'Den Hund an lockerer Leine im langsamen Schritt hindurchführen.',
      'Kein Springen: Der Hund soll jede Stange einzeln übersteigen.',
      'Am Ende wenden und zurücklaufen – das ist eine Wiederholung.',
    ],
    bloecke: [
      {
        name: 'Anfänger',
        punkte: ['Stangen auf dem Boden mit weitem Abstand', 'Stangen mit gleichmäßiger Höhe'],
      },
      {
        name: 'Profis',
        punkte: [
          'Stangen auf dem Boden mit kurzem Abstand',
          'Stangen mit variablem Abstand',
          'Stangen mit variabler Höhe',
        ],
      },
    ],
    achtung: ['Langsamer Schritt', 'Kein Springen'],
    recherche: [
      'Startwert für den Abstand: etwa die Schulterhöhe des Hundes bzw. eine normale Schrittlänge. Zu enge Abstände verleiten zum Hüpfen.',
      'Stangenhöhe zum Einstieg: Höhe des Handwurzelgelenks (Karpus), später bis Ellenbogenhöhe.',
      'Üblich sind 4–6 Stangen pro Reihe.',
      'Neben dem Hund hergehen und nicht ziehen. Er soll den Kopf senken dürfen – so sieht er die Stangen und belastet die Hinterhand stärker.',
      'Die Stangen müssen wegrollen oder herunterfallen können, wenn er sie touchiert. Keine fest verschraubten Hindernisse.',
    ],
    videos: [
      {
        id: 'px3_kS-K_Jw',
        titel: 'How to use cavaletti poles to stretch and strengthen your dog',
        kanal: 'Gatehouse Vet Rehab',
        sprache: 'EN',
      },
      {
        id: 'LrjXBXpfoxs',
        titel: 'Cavaletti-Training für Hunde – Tipps und Tricks',
        kanal: 'isy-training',
        sprache: 'DE',
      },
    ],
  },

  {
    id: 'slalom',
    titel: 'Slalom und 8-er laufen',
    kurz: 'Um Hindernisse herumführen – biegt die Wirbelsäule und kräftigt den Rumpf.',
    frequenz: '2–5 × täglich · je 2–3 Minuten',
    ziel: [
      'Fördert die Beweglichkeit der Wirbelsäule',
      'Gleichmäßige Gliedmaßenbelastung',
      'Kräftigt Rumpf- und Rückenmuskulatur',
    ],
    material: 'Bäume, Laternen, Pylonen oder Wasserflaschen',
    ablauf: [
      'Lässt sich gut in den Gassi-Gang einbauen.',
      'Den Hund im Slalom um die Hindernisse herumführen.',
      'Beim 8-er laufen zwei Punkte in einer liegenden Acht umrunden.',
      'Beide Seiten gleichmäßig trainieren.',
    ],
    bloecke: [
      {
        name: 'Anfänger',
        punkte: [
          'Hindernisse in gerader Linie, weite Abstände',
          'In Schrittgeschwindigkeit durch die Hindernisse führen',
        ],
      },
      {
        name: 'Fortgeschrittene',
        punkte: [
          'Ungleichmäßige Abstände der Hindernisse',
          'In verschiedenen Geschwindigkeiten führen (Schritt, Trab, langsam)',
        ],
      },
    ],
    achtung: ['Beide Seiten gleichmäßig trainieren', 'Nicht länger als 5 Minuten am Stück'],
    recherche: [
      'Abstand der Hindernisse zu Beginn etwa zwei Körperlängen; enger wird die Biegung deutlich anspruchsvoller.',
      'Beim 8-er laufen mit großem Radius starten und den Bogen erst nach und nach enger ziehen.',
      'Führhand wechseln, damit der Hund in beide Richtungen gleich oft gebogen wird.',
      'Auf eine gleichmäßige Schrittfolge achten. Ruckartiges Herumreißen an der Leine bringt keinen Trainingseffekt.',
    ],
    videos: [
      {
        id: 'WKKSwikMy5A',
        titel: 'Strengthening Exercises: Weaving and Figure-of-Eight',
        kanal: 'Gatehouse Vet Rehab',
        sprache: 'EN',
      },
    ],
  },

  {
    id: 'balancekissen',
    titel: 'Balance-Kissen',
    kurz: 'Stehen auf instabilem Untergrund – trainiert Gleichgewicht und Tiefensensibilität.',
    frequenz: '2–3 × täglich · je 3–5 Wiederholungen',
    ziel: [
      'Fördert Gleichgewichtssinn, Koordination und Motorik',
      'Gleichmäßige Gliedmaßenbelastung, Muskelkräftigung',
      'Noppen verstärken den propriozeptiven Reiz',
    ],
    material: 'Balance-Kissen (Noppenkissen), rutschfester Untergrund',
    ablauf: [
      'Kissen auf rutschfestem Untergrund platzieren.',
      'Den Hund selbst aufsteigen lassen und mit einem Leckerli auf Nasenhöhe stabilisieren.',
      'Ruhig stehen lassen, bis er die Balance gefunden hat, dann kontrolliert absteigen lassen.',
    ],
    bloecke: [
      {
        name: 'Anfänger',
        punkte: [
          'Stehen auf dem Balance-Kissen',
          'Nur Vordergliedmaßen, nur Hintergliedmaßen, alle vier Gliedmaßen gleichzeitig',
        ],
      },
      {
        name: 'Profis',
        punkte: [
          'Stehen auf 2 Balancekissen',
          'Sitz und Steh auf dem Balancekissen',
          'Stehen mit Gewichtsverlagerung (Beinchen anheben)',
        ],
      },
    ],
    achtung: [
      'Insbesondere bei neurologischen Patienten auf Hilfestellung und Schutz vor Umfallen oder Wegkippen achten',
    ],
    recherche: [
      'Das Kissen nur so weit aufpumpen, dass es spürbar nachgibt. Je praller, desto wackliger und anstrengender.',
      'Solange der Hund unsicher ist, das Kissen mit Fuß oder Knie gegen Wegrutschen sichern.',
      'Haltedauer 10–30 Sekunden. Beginnt der Hund zu zittern oder steigt ständig ab, ist die Übung zu Ende.',
      'Erst sicher stehen können, dann die Gewichtsverlagerung ergänzen.',
    ],
    videos: [
      {
        id: 'iXFz5n6510M',
        titel: 'Balance Exercises: Progressions & Combinations',
        kanal: 'Valiant Vet Physio',
        sprache: 'EN',
      },
    ],
  },

  {
    id: 'gewichtsverlagerung',
    titel: 'Gewichtsverlagerungen',
    kurz: 'Im Stand das Gewicht gezielt verlagern, ohne dass sich die Pfoten bewegen.',
    frequenz: 'Auf dem Handzettel ohne Angabe – üblich sind 1–3 × täglich, 3–5 Wiederholungen',
    ziel: [
      'Fördert die gleichmäßige Gliedmaßenbelastung',
      'Propriozeption und Balance',
      'Kraft und Ausdauer, kräftigt die Muskulatur',
    ],
    material: 'Rutschfester Untergrund, Leckerlis; für Fortgeschrittene ein federnder Untergrund',
    ablauf: [
      'Gewichtsverlagerung durch Leckerli: oberhalb, unterhalb, rechts und links des Kopfes führen.',
      'Gewichtsverlagerung durch Anheben von einer oder zwei Gliedmaßen.',
    ],
    bloecke: [
      {
        name: 'Fortgeschrittene',
        punkte: [
          'Gewichtsverlagerung auf federndem Untergrund (Balancekissen, Matratze, Luftmatratze)',
        ],
      },
    ],
    recherche: [
      'Der Hund steht ruhig und gerade, nur der Kopf folgt dem Leckerli. Macht er einen Schritt, war die Bewegung zu groß.',
      'Beim Anheben eine Pfote nur wenige Zentimeter lösen und 5–10 Sekunden halten. Diagonales Anheben (vorne links und hinten rechts) ist die schwerere Variante.',
      'Alternativ mit der flachen Hand sanft gegen Schulter oder Becken drücken, sodass der Hund dagegenhält, ohne einen Schritt zu machen.',
      'Die Frequenz fehlt auf dem Handzettel – die Angabe oben ist eine übliche Größenordnung, im Zweifel in der Praxis nachfragen.',
    ],
    videos: [
      {
        id: 'S6QokKi58jI',
        titel: 'Weight shifting exercises in a dog',
        kanal: 'Purdue Veterinary Medicine',
        sprache: 'EN',
      },
    ],
  },
];
