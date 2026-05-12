let darkMode = false;
let equiposState = [];
let equiposOriginal = [];
let searchTimeoutId = null;
let currentModal = null;
let currentImageViewer = null;
let currentImageViewerScale = 1;
let currentImageViewerOffsetX = 0;
let currentImageViewerOffsetY = 0;
let imageViewerBaseOffsetX = 0;
let imageViewerBaseOffsetY = 0;
let isImageViewerPanning = false;
let imageViewerPanPointerId = null;
let imageViewerPanStartX = 0;
let imageViewerPanStartY = 0;
let imageViewerPanStartOffsetX = 0;
let imageViewerPanStartOffsetY = 0;

const IMAGE_VIEWER_MIN_SCALE = 1;
const IMAGE_VIEWER_MAX_SCALE = 4;
const IMAGE_VIEWER_SCALE_STEP = 0.25;

const planeamientosData = {
    "Riñón": [
        {
            id: 1,
            titulo: "Nefrectomía Radical",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Remover quirúrgicamente el riñón afectado, junto con la grasa perirrenal y, si está indicado, la glándula suprarrenal y los ganglios linfáticos regionales, con el fin de controlar una neoplasia renal localmente avanzada o maligna.",
                    anatomia: {
                        titulo: "Anatomía del riñón",
                        contenido: `Son órganos bilaterales con forma de frijol ubicados en el retroperitoneo, es decir, en los cuadrantes abdominales superior derecho y superior izquierdo. Su forma característica ayuda a su orientación, ya que su borde cóncavo siempre se orienta hacia la línea media del cuerpo.

UBICACIÓN: Los riñones son órganos retroperitoneales, lo cual significa que están ubicados detrás del peritoneo parietal posterior, contra la pared abdominal posterior.

SUPERFICIES: El riñón cuenta con 2 caras (anterior y posterior) y 2 bordes (lateral cóncavo y medial convexo).

CAPAS PROTECTORAS:
1. Cápsula fibrosa (cápsula renal)
2. Cápsula adiposa (grasa perirrenal), que separa los riñones de los músculos de la pared abdominal posterior
3. Fascia renal que envuelve tanto al riñón como a la glándula suprarrenal`,
                        imagen: "./assets/planeamientos/nefrectomia-radical/anatomia-rinon.png"
                    },
                    partes: {   
                        titulo: "Partes del riñón",
                        items: [
                            {
                                nombre: "Nefrona",
                                    descripcion: "Unidades histológicas complejas diseñadas para filtrar la sangre y producir la orina. Se componen de corpúsculos y del sistema de túbulos renales asociados",
                                    imagen: "./assets/planeamientos/nefrectomia-radical/nefrona.png"
                            },
                            {
                                nombre: "Médula renal",
                                    descripcion: "Consta de numerosas masas piramidales compuestas por el sistema de túbulos renales, en total de 8 a 18 pirámides renales en cada riñón",
                                    imagen: "./assets/planeamientos/nefrectomia-radical/medula-renal.png"
                            },
                            {
                                nombre: "Papilas renales y cálices",
                                    descripcion: "Los vértices de las pirámides (papilas renales) están orientados hacia el hilio, donde se abren hacia un sistema de cámaras llamados cálices",
                                    imagen: "./assets/planeamientos/nefrectomia-radical/anatomia-superficie.png"
                            }
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación e inervación",
                        contenido: `IRRIGACIÓN: Cada riñón está irrigado por la arteria renal, una rama colateral de la arteria aorta abdominal. La arteria renal izquierda es mucho más corta que la derecha, ya que necesita pasar por detrás de la vena cava inferior.

INERVACIÓN: Los riñones están inervados por el plexo renal. Este plexo recibe aportes desde:
• El sistema nervioso simpático proveniente de los nervios esplácnicos torácicos para la regulación del tono vascular
• El sistema nervioso parasimpático, a través del nervio vago
• Los nervios sensitivos desde el riñón viajan a la médula espinal a nivel de T10-T11`,
                        imagen: "./assets/planeamientos/nefrectomia-radical/irrigacion-inervacion.png",
                        imagenInervacion: "./assets/planeamientos/nefrectomia-radical/inervacion.png",
                    },
                    fisiologia: {
                        titulo: "Fisiología renal",
                        funciones: [
                            { nombre: "Filtración glomerular", descripcion: "Ocurre en los glomérulos de la nefrona. La sangre entra a través de la arteriola aferente y es filtrada a través de la membrana glomerular, formándose el filtrado glomerular que contiene agua, electrolitos, glucosa y desechos metabólicos." },
                            { nombre: "Reabsorción y secreción tubular", descripcion: "Túbulo proximal: se reabsorbe 65-70% del agua, sodio, glucosa y aminoácidos. Asa de Henle: se reabsorbe agua en la parte descendente y sodio/cloro en la ascendente. Túbulo distal y colector: regulan reabsorción de sodio, potasio y agua por aldosterona y ADH." },
                            { nombre: "Regulación ácido-base", descripcion: "Se encargan de excretar iones de hidrógeno y reabsorben bicarbonato con el fin de mantener el pH sanguíneo estable." },
                            { nombre: "Regulación de presión arterial", descripcion: "Liberan renina cuando hay baja presión sanguínea, activando el sistema renina-angiotensina-aldosterona (RAA) que aumenta la retención de agua y sodio." },
                            { nombre: "Producción de hormonas", descripcion: "Producen eritropoyetina (estimula producción de glóbulos rojos) y calcitriol (regula absorción de calcio y fósforo)." }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta general", "Canasta de tórax", "Canasta vascular", "Pinza liga clip", "Clamp de pedículo"],
                            equipos: ["Paquete de ropa", "Sábana adicional", "Compresas", "Electrobisturí", "Caucho de succión", "Aseptojeringa", "HB # 20-15", "Gasas", "Apósitos", "Guantes", "Hemolock", "Frasco de patología", "Equipo de venoclisis o sonda nasogástrica 16", "Vessel loops"],
                            suturas: ["PIEL: Polipropileno 2/0 o 3/0 con aguja 3/8 de círculo cortante de 27 mm", "TCS: Poliglactina 910 2/0 con aguja ½ círculo redonda de 27 mm", "FASCIA Y MÚSCULO: Poliglactina 910 1 o 0 con aguja ½ círculo redonda de 37 mm", "VASOS RENALES: Seda precortada 1 o 0", "VASOS POLARES: Seda precortada 2/0 o 3/0", "URÉTER: Poliglactina 910 3/0 o 4/0 con ½ círculo redonda"],
                            farmacos: ["Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/nefrectomia-radical/mesa-mayo.png" },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/nefrectomia-radical/mesa-reserva.png" },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito lateral", descripcion: "El paciente se coloca en posición lateral con el lado afectado elevado, permitiendo acceso óptimo al riñón retroperitoneal. La cadera se flexiona ligeramente para ampliar el espacio intercostal.", imagen: "./assets/planeamientos/nefrectomia-radical/posicion-decubito.png" },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [{ rol: "Cirujano", posicion: "Posterior al paciente (lado craneal)" }, { rol: "Anestesiólogo", posicion: "Cabecera del paciente (izquierda)" }, { rol: "Instrumentador", posicion: "Anterior al paciente (ventral)" }, { rol: "Ayudante", posicion: "Opuesto al cirujano (lado caudal)" }, { rol: "Mesa de Mayo", posicion: "Lateral derecha del paciente" }, { rol: "Mesa de Reserva", posicion: "Lateral derecha del paciente" }], imagen: "./assets/planeamientos/nefrectomia-radical/posicion-equipo.png" }
                },
                ejecucion: {
                    anestesia: "Anestesia General",
                    incision: { nombre: "Incisión subcostal", tipo: "Lumbotomía", descripcion: "La incisión más común. Se realiza en el costado del paciente, justo debajo de las costillas o entre las costillas 11ª y 12ª. El abordaje retroperitoneal es el más común para la nefrectomía abierta, se accede al riñón directamente a través de los músculos de la pared posterior, sin necesidad de entrar en la cavidad peritoneal.", imagen: "./assets/planeamientos/nefrectomia-radical/incision-subcostal.png" },
                    pasos: [
                        { paso: 1, tecnica: "Incisión de lumbotomía en piel, TCS y músculo", instrumental: ["Mango de bisturí #4", "Hoja de bisturí #20", "Separador de Farabeuf", "Electrobisturí"] },
                        { paso: 2, tecnica: "Hemostasia", instrumental: ["Pinzas Kelly curva", "Electrobisturí"] },
                        { paso: 3, tecnica: "Visualización de la fascia", instrumental: ["Separadores de Farabeuf", "Electrobisturí"] },
                        { paso: 4, tecnica: "Sección de la fascia de Gerota", instrumental: ["Tijeras de Metzembaum", "Pinza de disección larga"] },
                        { paso: 5, tecnica: "Apertura del peritoneo posterior", instrumental: ["Tijeras de Metzembaum", "Disección larga"] },
                        { paso: 6, tecnica: "Visualización y disección de vasos renales en la aorta y cava", instrumental: ["Tijeras de Metzembaum", "Pinza de disección vascular", "Pinza cístico", "Vessel loop"] },
                        { paso: 7, tecnica: "Disección y reparo de uréter hasta vejiga", instrumental: ["Tijeras de Metzembaum", "Pinza de disección vascular", "Pinza cístico", "Vessel loop"] },
                        { paso: 8, tecnica: "Clampeo de vasos renales en la aorta y cava", instrumental: ["Clamps de Satinsky o Debakey", "Pinza Rochester curva"] },
                        { paso: 9, tecnica: "Doble ligadura de vasos renales en la aorta y cava", instrumental: ["Pinza cístico", "Pinza Kelly Adson", "Seda precortada 1 o 0"] },
                        { paso: 10, tecnica: "Jareta de aorta y cava", instrumental: ["Portagujas largo vascular", "Disección vascular", "Polipropileno 5/0 doble aguja"] },
                        { paso: 11, tecnica: "Clampeo, sección, ligadura de uréter en la vejiga", instrumental: ["Pinzas Kelly Adson", "Tijeras Metzembaum", "Portagujas", "Catgut cromado 3/0 o 4/0 aguja redonda"] },
                        { paso: 12, tecnica: "Toma de los vasos de la glándula suprarrenal, sección y ligadura", instrumental: ["Pinza Kelly Adson", "Tijeras de Metzembaum", "Seda precortada 2/0"] },
                        { paso: 13, tecnica: "Extracción en bloque de riñón, grasa perirrenal y fascia de Gerota", instrumental: ["Disección ganglionar", "Tijeras de Metzembaum", "Pinza de disección vascular"] },
                        { paso: 14, tecnica: "Disección ganglionar", instrumental: ["Separadores de vena", "Tijeras de Metzembaum", "Disección vascular"] },
                        { paso: 15, tecnica: "Toma y ligadura de ganglios linfáticos posteriores", instrumental: ["Pinzas Kelly Adson"] },
                        { paso: 16, tecnica: "Disección de ganglios posteriores", instrumental: ["Separadores de vena", "Tijeras de Metzembaum", "Disección vascular"] },
                        { paso: 17, tecnica: "Hemostasia y colocación de drenaje", instrumental: ["Pinza Kelly curva", "Pinza Rochester curva", "Electrobisturí", "Seda 2/0 o 0 con aguja curva"] },
                        { paso: 18, tecnica: "Recuento de compresas", instrumental: ["Pinza Foerster"] },
                        { paso: 19, tecnica: "Lavado de cavidad, se coloca Hemolock", instrumental: ["Solución salina tibia", "Pinza ligaclip"] },
                        { paso: 20, tecnica: "Cierre por planos y curación de heridas", instrumental: ["Portagujas mediano", "Pinza de disección con garra", "Separador de Farabeuf", "Suturas para cada plano", "Apósitos", "Micropore"] }
                    ]
                }
            }
        },
        {
            id: 2,
            titulo: "Nefrectomía parcial",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: `El objetivo quirúrgico de una nefrectomía abierta parcial es extirpar la porción enferma o tumoral del riñón, preservando la mayor cantidad posible de tejido renal sano restante. Esto se realiza principalmente en casos de tumores renales pequeños y localizados, o en situaciones donde la preservación de la función renal es crucial, como en pacientes con un solo riñón funcional o con riesgo de desarrollar insuficiencia renal.`,
                    anatomia: {
                        titulo: "Anatomía del riñón",
                        contenido: `Son órganos bilaterales con forma de frijol ubicados en el retroperitoneo, es decir, en los cuadrantes abdominales superior derecho y superior izquierdo. Su forma característica ayuda a su orientación, ya que su borde cóncavo siempre se orienta hacia la línea media del cuerpo.

SUPERFICIES: El riñón cuenta con 2 caras (anterior y posterior) y 2 bordes (lateral cóncavo y medial convexo).

CAPAS PROTECTORAS:
1. Cápsula fibrosa (cápsula renal)
2. Cápsula adiposa (grasa perirrenal), que separa los riñones de los músculos de la pared abdominal posterior
3. Fascia renal que envuelve tanto al riñón como a la glándula suprarrenal y a su grasa periférica.`,
                        imagenes: ["./assets/planeamientos/nefrectomia-parcial/images/image4.png", "./assets/planeamientos/nefrectomia-parcial/images/image7.png", "./assets/planeamientos/nefrectomia-parcial/images/image5.png", "./assets/planeamientos/nefrectomia-parcial/images/image18.png", "./assets/planeamientos/nefrectomia-parcial/images/image17.png"]
                    },
                    partes: {
                        titulo: "Partes del riñón",
                        items: [
                            { nombre: "Nefrona", descripcion: "Las nefronas son unidades histológicas complejas diseñadas para filtrar la sangre y producir la orina; se componen de corpúsculos y del sistema de túbulos renales asociados." },
                            { nombre: "Médula renal", descripcion: "La médula consta de numerosas masas piramidales compuestas por el sistema de túbulos renales, en total de 8 a 18 pirámides renales en cada riñón, que van contiguas entre sí, con sus bases dirigidas hacia la corteza renal." },
                            { nombre: "Papilas renales y cálices", descripcion: "Los vértices de las pirámides, llamados papilas renales, están orientados hacia el hilio, donde se abren hacia un sistema de cámaras llamados cálices." }
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación e inervación",
                        contenido: `Cada riñón está irrigado por la arteria renal, una rama colateral de la arteria aorta abdominal. La arteria renal izquierda es mucho más corta que la derecha, ya que necesita pasar por detrás de la vena cava inferior para llegar al riñón derecho.

Inervación: los riñones están inervados por el plexo renal. Este plexo recibe aportes del sistema nervioso simpático, del sistema nervioso parasimpático a través del nervio vago y de fibras sensitivas que viajan a la médula espinal a nivel de T10-T11.`,
                        imagenes: ["./assets/planeamientos/nefrectomia-parcial/images/image13.png", "./assets/planeamientos/nefrectomia-parcial/images/image14.png"]
                    },
                    fisiologia: {
                        titulo: "Fisiología renal",
                        funciones: [
                            { nombre: "Homeostasis corporal", descripcion: "Los riñones participan en la regulación de la osmolaridad y el pH de la sangre, del volumen total de sangre y de la presión arterial, así como en la producción de hormonas y filtración de sustancias externas." },
                            { nombre: "Filtración glomerular", descripcion: "Ocurre en los glomérulos de la nefrona. La sangre entra por la arteriola aferente y se filtra a través de la membrana glomerular, formándose un filtrado con agua, electrolitos, glucosa y desechos metabólicos." },
                            { nombre: "Reabsorción y secreción tubular", descripcion: "Túbulo proximal: se reabsorbe 65-70% del agua, sodio, glucosa y aminoácidos. Asa de Henle: se reabsorbe agua en la parte descendente y sodio/cloro en la ascendente. Túbulo distal y colector: regulan la reabsorción por aldosterona y ADH." },
                            { nombre: "Regulación ácido-base", descripcion: "Excretan iones de hidrógeno y reabsorben bicarbonato para mantener el pH sanguíneo estable." },
                            { nombre: "Regulación de presión arterial", descripcion: "Liberan renina cuando hay baja presión sanguínea, activando el sistema renina-angiotensina-aldosterona (RAA) que aumenta la retención de agua y sodio." },
                            { nombre: "Producción de hormonas", descripcion: "Producen eritropoyetina, que estimula la producción de glóbulos rojos, y calcitriol, que regula la absorción de calcio y fósforo." }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta general", "Canasta vascular", "Canasta de tórax", "Separador de vena", "Lima"],
                            equipos: ["Paquete de ropa", "Compresas", "Electrobisturí", "Vassell lopp o dren en cigarrillo", "Suero congelado", "Sábana accesoria", "Caucho de succión", "Aseptojeringa", "HB # 20 – 15", "Torundas", "Gasas", "Apósitos", "Guantes", "Sonda nelaton"],
                            suturas: ["PIEL: Polipropileno 2/0 o 3/0 con aguja 3/8 de círculo cortante", "TCS: Poliglactina 910 2/0 con aguja ½ círculo redonda", "FASCIA Y MÚSCULO: Poliglactina 910 1 o 0 con aguja ½ círculo redonda", "Catgut cromado 3/0 o 4/0 para sistema colector"],
                            farmacos: ["Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/nefrectomia-parcial/images/image15.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/nefrectomia-parcial/images/image16.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito lateral (lumbotomía)", descripcion: "Posición del paciente de cubito lateral o lumbotomía.", imagen: "./assets/planeamientos/nefrectomia-parcial/images/image1.jpg", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/nefrectomia-parcial/images/image20.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general",
                    anestesiaImagen: "./assets/planeamientos/nefrectomia-parcial/images/image11.jpg",
                    incision: { nombre: "Lumbotomía", tipo: "Abordaje retroperitoneal", descripcion: "Lumbotomía es la incisión más común. Se realiza en el costado del paciente, justo debajo de las costillas o entre las costillas 11ª y 12ª. El abordaje retroperitoneal es el más común para la nefrectomía parcial abierta, se accede al riñón directamente a través de los músculos de la pared posterior, sin necesidad de entrar en la cavidad peritoneal.", imagen: "./assets/planeamientos/nefrectomia-parcial/images/image9.png" },
                    pasos: [
                        { paso: 1, tecnica: "Se hace una incisión de 6-8 cm entre las costillas 11 y 12", instrumental: ["Mango de bisturí #4", "Hoja de bisturí #20"] },
                        { paso: 2, tecnica: "Se realiza hemostasia", instrumental: ["Pinza Kelly curva", "Electrobisturí"] },
                        { paso: 3, tecnica: "Visualización de la fascia e incisión del músculo lumbar", instrumental: ["Separadores de Farabeuf", "Mango de bisturí #4", "Hoja de bisturí #20"] },
                        { paso: 4, tecnica: "En caso de resecar costilla, se diseca el periostio superior e inferior, se sostiene la costilla, se corta y se limpia asperezas", instrumental: ["Elevador de periostio", "Separador de Doyen derecho e izquierdo", "Pinza de campo", "Gubia", "Cizalla", "Costotomo y lima"] },
                        { paso: 5, tecnica: "Se llega directamente al retroperitoneo", instrumental: ["Separador de Deaver"] },
                        { paso: 6, tecnica: "Visualización de la fascia de Gerota, exposición y resección de grasa", instrumental: ["Tijeras de Metzenbaum", "Disección larga"] },
                        { paso: 7, tecnica: "Disección del uréter", instrumental: ["Pinza cístico", "Tijera de Metzenbaum", "Disección vascular"] },
                        { paso: 8, tecnica: "Reparación de uréter", instrumental: ["Pinza Kelly recta", "Vessel lopp"] },
                        { paso: 9, tecnica: "Exposición y disección de vasos renales", instrumental: ["Tijera de Metzenbaum", "Disección vascular", "Compresas"] },
                        { paso: 10, tecnica: "Hipotermia del riñón", instrumental: ["Solución salina congelada"] },
                        { paso: 11, tecnica: "Clampeo de vasos renales", instrumental: ["Clamp de Satinsky", "Clamp de Debakey"] },
                        { paso: 12, tecnica: "Incisión de la cápsula renal y disección roma", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15", "Pinza Rochester recta"] },
                        { paso: 13, tecnica: "Técnica de guillotina, corte recto del polo renal", instrumental: ["Mango de bisturí #4", "Hoja de bisturí #20"] },
                        { paso: 14, tecnica: "Cierre del parénquima renal y sistema colector; hemostasia", instrumental: ["Porta agujas largo fino", "Catgut cromado 3/0 aguja redonda"] },
                        { paso: 15, tecnica: "Cierre de cápsula renal", instrumental: ["Porta agujas fino", "Catgut cromado 3/0 aguja redonda"] },
                        { paso: 16, tecnica: "Se revisa si el riñón tiene su coloración normal", instrumental: [] },
                        { paso: 17, tecnica: "Se retira el reparo y se coloca dren por la contra abertura", instrumental: ["Vassell lopp", "Sonda nelaton", "Seda 2/0 aguja curva cortante", "Portaagujas"] },
                        { paso: 18, tecnica: "Cierre por planos y curación de herida", instrumental: ["Portaagujas", "Disección con garra", "Separador de Farabeuf", "Sutura por planos"] }
                    ]
                }
            }
        }
    ],


    "Pelvis renal": [
        { id: 3, titulo: "Plastia pieloureteral", tipo: "simple", resumen: "Reconstrucción de unión pieloureteral, drenaje y sellado." },
        {
            id: 13,
            titulo: "Ureteroscopia Flexible con Láser Holmium",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Acceder al uréter y al riñón para visualizar el cálculo y desintegrarlo mediante la utilización de un láser Holmium.",
                    anatomia: {
                        titulo: "Anatomía de la pelvis renal",
                        contenido: `La pelvis renal es una estructura anatómica del sistema urinario situada en el hilio del riñón. Tiene forma de embudo, con una amplia base que recibe la orina de los cálices mayores y una punta estrecha que se continúa con el uréter.

Está compuesta por cáliz mayor, cáliz menor y uréter.

Estructuralmente está constituida por una mucosa, una túnica muscular lisa dispuesta en una capa interna circular que ayuda al movimiento de la orina por medio de contracciones peristálticas, una capa externa longitudinal y una adventicia. La pelvis renal está revestida por un epitelio de transición llamado urotelio, que es flexible y resistente a la orina.`,
                        imagenes: [
                            "./assets/planeamientos/ureteroscopia-flexible/images/image4.png",
                            "./assets/planeamientos/ureteroscopia-flexible/images/image11.png"
                        ],
                        imagenDebajo: "./assets/planeamientos/ureteroscopia-flexible/images/image3.png"
                    },
                    partes: {
                        titulo: "Partes de la pelvis renal",
                        items: [
                            { nombre: "Cáliz mayor", descripcion: "Recibe la orina proveniente de los cálices menores." },
                            { nombre: "Cáliz menor", descripcion: "Conduce la orina hacia los cálices mayores." },
                            { nombre: "Uréter", descripcion: "Continúa la pelvis renal y transporta la orina hacia la vejiga." }
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación, inervación y drenaje venoso",
                        contenido: `Se encuentra irrigada anteriormente por la arteria renal; de manera posterior, la rama posterior se prolonga hacia los vasos prevertebrales, gonadal, ilíaca común, vesical y uterina.

Recibe inervación parasimpática de los nervios esplácnicos pélvicos y del plexo hipogástrico inferior.

Su drenaje venoso consta de las ramas de la vena renal. La sangre de la pelvis renal drena hacia las venas renales, que luego desembocan en la vena cava inferior. Los plexos venosos de la pelvis rodean los órganos pélvicos, y la mayoría de los plexos venosos desembocan en la vena ilíaca interna.`,
                        imagenes: [
                            "./assets/planeamientos/ureteroscopia-flexible/images/image6.png",
                            "./assets/planeamientos/ureteroscopia-flexible/images/image5.png",
                            "./assets/planeamientos/ureteroscopia-flexible/images/image10.png"
                        ]
                    },
                    fisiologia: {
                        titulo: "Fisiología de la pelvis renal",
                        funciones: [
                            { nombre: "Recogida y canalización", descripcion: "La orina producida en las nefronas se recoge en los túbulos colectores y luego se drena hacia los cálices menores, luego hacia los cálices mayores y finalmente a la pelvis." },
                            { nombre: "Peristalsis", descripcion: "Las contracciones peristálticas del músculo liso en la pared de la pelvis renal ayudan a propulsar la orina hacia el uréter." },
                            { nombre: "Prevención del reflujo", descripcion: "La anatomía de la unión pieloureteral ayuda a prevenir el reflujo de orina hacia los riñones, evitando infecciones y daño renal." },
                            { nombre: "Adaptabilidad", descripcion: "El urotelio puede expandirse y contraerse, permitiendo manejar diferentes volúmenes de orina sin sufrir daño." },
                            { nombre: "Protección inmunológica", descripcion: "La mucosa actúa como barrera defensiva contra patógenos y sustancias tóxicas presentes en la orina." }
                        ],
                        imagenes: ["./assets/planeamientos/ureteroscopia-flexible/images/image8.png"]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Lithoviue (Ureteroscopio flexible o Storz)", "Torre de laparoscopia", "Intensificador de imagen", "Mesa radiolúcida", "Cistoscopio", "Canastilla", "Láser Holmium", "Fibras del láser"],
                            equipos: ["Paquete de ropa", "Guantes", "Compresas", "Platón", "Guías de nitinol", "Sondas Foley", "Catéter doble J", "Jeringas", "Medio de contraste", "Caucho de succión", "Camisa ureteral", "Fundas de intensificador de imagen"],
                            suturas: ["Piel: Polipropileno 3/0 ACC 3/8.", "Polidioxanona 4/0 ACC para niños.", "Tejido celular subcutáneo: Poliglactina 910 3/0 ACR 1/2 círculo.", "Fascia - músculo: Poliglactina 910 1 o 0 ACR 1/2 círculo.", "Pieloplastia: Poliglactina 910 4/0 - 5/0 ACR 1/2.", "Pieloplastia: Polidioxanona 4/0 - 5/0 ACR 1/2."],
                            farmacos: ["Solución salina", "Xilocaína de jalea", "Lactato de Ringer o Glicina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/ureteroscopia-flexible/images/image9.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/ureteroscopia-flexible/images/image7.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Litotomía", descripcion: "Posición de litotomía para facilitar el acceso endoscópico y el control radiológico.", imagen: "./assets/planeamientos/ureteroscopia-flexible/images/image2.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/ureteroscopia-flexible/images/image12.jpg", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general",
                    incision: { nombre: "Transperitoneal", tipo: "Abordaje transperitoneal", descripcion: "Se realiza incisión transperitoneal para el acceso endoscópico." },
                    pasos: [
                        { paso: 1, tecnica: "Uso de lidocaína intrauretral e identificación del meato ureteral izquierdo o derecho", instrumental: ["Lidocaína intrauretral"] },
                        { paso: 2, tecnica: "Paso de la guía de nitinol hasta el riñón bajo intensificador de imagen", instrumental: ["Guía de nitinol", "Intensificador de imagen"] },
                        { paso: 3, tecnica: "Paso de la camisa ureteral por la guía bajo intensificador", instrumental: ["Camisa ureteral", "Intensificador de imagen"] },
                        { paso: 4, tecnica: "Paso del Lithoviue hasta el riñón", instrumental: ["Lithoviue (ureteroscopio flexible)"] },
                        { paso: 5, tecnica: "Realización de nefroscopia", instrumental: ["Lithoviue (ureteroscopio flexible)"] },
                        { paso: 6, tecnica: "Identificación del cálculo", instrumental: ["Lithoviue (ureteroscopio flexible)"] },
                        { paso: 7, tecnica: "Paso de fibra láser por dentro del Lithoviue", instrumental: ["Láser Holmium", "Fibras del láser"] },
                        { paso: 8, tecnica: "Evacuación de fragmentos con canastillas y colocación del catéter doble J", instrumental: ["Canastilla", "Catéter doble J"] },
                        { paso: 9, tecnica: "Paso de sonda vesical si lo requiere", instrumental: ["Sonda Foley"] }
                    ]
                }
            }
        },
        {
            id: 21,
            titulo: "Pieloplastia",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Realizar la reconstrucción quirúrgica de la unión pieloureteral (UPU) para corregir la estenosis o defecto funcional que causa obstrucción al flujo de orina. Este procedimiento está indicado en pacientes con obstrucción sintomática, deterioro de la función renal o hidronefrosis significativa. El objetivo es restaurar el drenaje urinario normal desde la pelvis renal hacia el uréter, previniendo complicaciones como infecciones recurrentes, litiasis o pérdida progresiva de función renal.",
                    anatomia: {
                        titulo: "Anatomía de la pelvis renal",
                        contenido: `La pelvis renal es una estructura anatómica del sistema urinario situada en el hilio del riñón. Tiene forma de embudo, con una amplia base que recibe la orina de los cálices mayores y una punta estrecha que se continúa con el uréter.

Está compuesta por cáliz mayor, cáliz menor y uréter. La unión pieloureteral (UPU) es la zona de transición entre la pelvis renal y el uréter, una región crítica donde pueden ocurrir estenosis o defectos funcionales que obstruyen el flujo de orina.

Estructuralmente está constituida por una mucosa, una túnica muscular lisa dispuesta en una capa interna circular que ayuda al movimiento de la orina por medio de contracciones peristálticas, una capa externa longitudinal y una adventicia. La pelvis renal está revestida por un epitelio de transición llamado urotelio, que es flexible y resistente a la orina.`,
                        imagenes: [
                            "./assets/planeamientos/pieloplastia/images/image7.png",
                            "./assets/planeamientos/pieloplastia/images/image5.png"
                        ],
                        imagenDebajo: "./assets/planeamientos/pieloplastia/images/image2.png"
                    },
                    partes: {
                        titulo: "Partes de la pelvis renal",
                        items: [
                            { nombre: "Cáliz mayor", descripcion: "Recibe la orina proveniente de los cálices menores." },
                            { nombre: "Cáliz menor", descripcion: "Conduce la orina hacia los cálices mayores." },
                            { nombre: "Unión pieloureteral (UPU)", descripcion: "Zona de transición entre la pelvis renal y el uréter donde pueden ocurrir estenosis u obstrucción del flujo de orina." },
                            { nombre: "Uréter", descripcion: "Continúa la pelvis renal y transporta la orina hacia la vejiga." }
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación, inervación y drenaje venoso",
                        contenido: `Se encuentra irrigada anteriormente por la arteria renal; de manera posterior, la rama posterior se prolonga hacia los vasos prevertebrales, gonadal, ilíaca común, vesical y uterina.

Recibe inervación parasimpática de los nervios esplácnicos pélvicos y del plexo hipogástrico inferior.

Su drenaje venoso consta de las ramas de la vena renal. La sangre de la pelvis renal drena hacia las venas renales, que luego desembocan en la vena cava inferior. Los plexos venosos de la pelvis rodean los órganos pélvicos, y la mayoría de los plexos venosos desembocan en la vena ilíaca interna.

La anatomía vascular del área de la UPU es crucial durante la cirugía para evitar daño a los vasos sanguíneos, particularmente aquellos que cruzan la unión pieloureteral.`,
                        imagenes: [
                            "./assets/planeamientos/pieloplastia/images/image3.png",
                            "./assets/planeamientos/pieloplastia/images/image8.png",
                            "./assets/planeamientos/pieloplastia/images/image4.png"
                        ]
                    },
                    fisiologia: {
                        titulo: "Fisiología de la pelvis renal",
                        funciones: [
                            { nombre: "Recogida y canalización", descripcion: "La orina producida en las nefronas se recoge en los túbulos colectores y luego se drena hacia los cálices menores, luego hacia los cálices mayores y finalmente a la pelvis." },
                            { nombre: "Peristalsis", descripcion: "Las contracciones peristálticas del músculo liso en la pared de la pelvis renal ayudan a propulsar la orina hacia el uréter a través de la unión pieloureteral." },
                            { nombre: "Prevención del reflujo", descripcion: "La anatomía de la unión pieloureteral ayuda a prevenir el reflujo de orina hacia los riñones, evitando infecciones y daño renal. Una obstrucción en esta zona impide el flujo normal de orina." },
                            { nombre: "Adaptabilidad", descripcion: "El urotelio puede expandirse y contraerse, permitiendo manejar diferentes volúmenes de orina sin sufrir daño, pero la estenosis previene la progresión normal de orina." },
                            { nombre: "Protección inmunológica", descripcion: "La mucosa actúa como barrera defensiva contra patógenos y sustancias tóxicas presentes en la orina." }
                        ],
                        imagenes: ["./assets/planeamientos/pieloplastia/images/image6.png"]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: [
                                "Cistoscopio",
                                "Pinza de cuerpos extraños",
                                "Pinza de canastilla",
                                "Cámara",
                                "Lente de 30",
                                "Fuente de luz"
                            ],
                            equipos: [
                                "Paquete de ropa general",
                                "Funda de mayo",
                                "Equipo de macrogoteo",
                                "Torre de endoscopio",
                                "Catéter doble J",
                                "Guías ureterales",
                                "Camisas ureterales",
                                "Sonda nelaton 8"
                            ],
                            suturas: [
                                "Piel: Polipropileno 3/0 ACC 3/8",
                                "Piel: Polidioxanona 4/0 ACC (para niños)",
                                "Tejido celular subcutáneo: Poliglactina 910 3/0 ACR 1/2 círculo",
                                "Fascia - Músculo: Poliglactina 910 1 o 0 ACR 1/2 círculo",
                                "Pieloplastia: Poliglactina 910 4/0 - 5/0 ACR 1/2",
                                "Pieloplastia: Polidioxanona 4/0 - 5/0 ACR 1/2"
                            ],
                            farmacos: [
                                "Solución salina",
                                "Xilocaína de jalea"
                            ]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo y de Reserva", items: [], imagen: "./assets/planeamientos/pieloplastia/images/image11.png", large: true },
                    mesaReserva: { titulo: "", items: [], imagen: "", large: false },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito lateral", descripcion: "Posición de decúbito lateral para facilitar el acceso retroperitoneal a la unión pieloureteral.", imagen: "./assets/planeamientos/pieloplastia/images/image1.jpg", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/pieloplastia/images/image9.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia General.",
                    incision: { nombre: "Incisión transperitoneal", tipo: "Abordaje transperitoneal", descripcion: "Se realiza incisión transperitoneal" },
                    pasos: [
                        { paso: 1, tecnica: `TÉCNICA QUIRÚRGICA
                            Se utilizan habitualmente 3 puertos (óptica dos operativos),pudiendo utilizar de forma opcional
                            un 4º puerto`, instrumental: ["Torre de laparoscopia (Monitor, insuflador, fuente de luz)", "Lente de 30°", "Cable de fibra óptica", "Trocares de 10mm y 5mm", "Aguja de Veress o técnica de Hasson"] },
                        { paso: 2, tecnica: `El paciente se coloca en decúbito lateral`, instrumental: ["Mesa quirúrgica con accesorios", "Almohadas y rollos de posicionamiento", "Soportes laterales", "Cinta o fijaciones"] },
                        { paso: 3, tecnica: `Disección de la unión  pieloureteral
                            Se realiza una incisión en el espacio parietocólico para desplazar el colon medialmente y se diseca el polo inferior del riñón y pelvis renal. Si se identifica un vaso polar, se diseca. Se debe liberar la pelvis renal y la unión Pieloureteral de todas sus adherencias adyacentes`, instrumental: ["Pinza de disección Maryland laparoscópica", "Tijeras de Metzenbaum laparoscópicas", "Gancho (Hook) o monopolar", "Pinza Grasper atraumática", "Succión/Irrigación"] },
                        { paso: 4, tecnica: `Extirpación de la unión pieloureteral
                            Se secciona el uréter por debajo de la unión pieloureteral de forma oblicua para dejarlo
                            espatulado en su borde superior. Se amplía con las tijeras hasta conseguir una espatulación de aproximadamente cm. En el caso de existir un vaso polar inferior, se moviliza a un plano posterior al que corresponderá a la anastomosis.`, instrumental: ["Tijeras laparoscópicas curvas de corte fino", "Pinza de disección Maryland", "Pinza Grasper"]  },
                        { paso: 5, tecnica: `Se secciona longitudinalmente en sentido oblicuo  el borde medial de la pelvis renal por encima de las estenosis ureteral para conseguir una apertura de al menos 1 centímetro`, instrumental: ["Tijeras laparoscópicas curvas", "Pinza Maryland"] },
                        { paso: 6, tecnica: `En el caso de pelvis muy redundantes se puede realizar una resección algo más amplia de la pelvis aunque se debe de tener cuidado en no resecar demasiado (una resección excesiva puede ocasionar un Acceso de la pelvis que dificulte su cierre posterior)`, instrumental: ["Tijeras laparoscópicas curvas", "Pinza Grasper atraumática"]  },
                        { paso: 7, tecnica: `Sutura de la cara anterior de la unión pieloureteral
                            Para realizar anastomosis,se utiliza poligliactin 4-0. El primer punto se da de fuera adentro en
                            el vértice inferior de la apertura piélica,pasándolo a continuación de dentro afuera por el vértice
                            de la espatulación realizada en el uréter.
                            Este punto constituye en el extremo más caudal de la lanosis a realizar y iniciándose a continuación una estructura continua en sentido proximal de la cara anterior de las anastomosis,  pasando la aguja de afuera adentro en la pelvis y de dentro afuera en el uréter.`, instrumental: ["Portaagujas laparoscópico (x2)", "Pinza de disección atraumática", "Sutura Poliglactina 910 4-0 (aguja 1/2 círculo redonda)"] },
                        { paso: 8, tecnica: `Colocación anterógrada del catéter doble J
                            Finalizada la sutura de la cara anterior, se introdujo un catéter doble J de forma anterógrada. Para ello se extrae por el puerto más craneal una guía metálica que es introducida retrógradamente a través del catéter colocado al inicio de la intervención`, instrumental: ["Set de Catéter Doble J", "Guía metálica de 0.035\"", "Pinza Grasper", "Empujador de catéter"]  },
                        { paso: 9, tecnica: `Sutura de la cara posterior de la unión pieloureteral
                            A continuación, se inicia pasando la aguja primero por la pelvis de fuera adentro y seguidamente por el uréter de dentro afuera`, instrumental: ["Portaagujas laparoscópico", "Pinza de disección atraumática", "Sutura Poliglactina 910 4-0"]  },
                        { paso: 10, tecnica: `Finalizada la anastomosis ureteropiélica, se introduce un Rendón número 14 por el trocar operativo más inferior. Se extrae los trocares cerrándose en los puertos correspondientes a los trocares de 10 mm`, instrumental: ["Drenaje Redon #14", "Portaagujas convencional (para cierre de piel)", "Pinza de disección con garra", "Sutura Polipropileno 3/0 (piel)", "Sutura Poliglactina 910 0 o 2/0 (aponeurosis)"]  }
                    ]
                }
            }
        }
    ],


    "Uréter": [
            {
            id: 4,
            titulo: "Uretroplastia",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Reparar una malformación, lesión o corte de uno o dos uréteres y corregir la estenosis ureteral.",
                    anatomia: {
                        titulo: "Anatomía y fisiología del uréter",
                        secciones: [
                            {
                                titulo: "Anatomía y fisiología",
                                contenido: `Los uréteres son tubos largos y delgados formados de músculo liso. En los adultos, los uréteres miden 25-30 cm de largo, aproximadamente la longitud de una regla de 12 pulgadas.

Los uréteres empujan cada pequeña cantidad de orina en forma de ondas de contracción, a baja presión. En la vejiga, cada uréter atraviesa la pared de la vejiga por una abertura que se cierra cuando la vejiga se contrae para evitar que la orina retroceda.`,
                                imagenes: ["./assets/planeamientos/uretroplastia/images/image1.jpg"]
                            },
                            {
                                titulo: "Capas",
                                contenido: `El uréter está compuesto por tres capas principales organizadas de adentro hacia afuera. La capa más interna es la mucosa, formada por un epitelio de transición (urotelio) que permite la distensión, y una lámina propia de tejido conectivo. Esta capa está en contacto directo con la orina.

La siguiente es la capa muscular, compuesta por músculo liso dispuesto en dos capas: una longitudinal interna y una circular externa; en el tercio inferior del uréter puede haber una tercera capa longitudinal externa. Esta capa es responsable del movimiento peristáltico que impulsa la orina hacia la vejiga.

Finalmente, la capa más externa es la adventicia, constituida por tejido conectivo laxo que contiene vasos sanguíneos, linfáticos y nervios, y que fija el uréter a las estructuras circundantes.`,
                                imagen: "./assets/planeamientos/uretroplastia/images/image3.png",
                                large: true
                            },
                            {
                                titulo: "Irrigación del uréter",
                                contenido: `La irrigación del uréter es segmentaria y proviene de varias arterias a lo largo de su trayecto desde el riñón hasta la vejiga.

En el tercio superior, el uréter recibe ramas de la arteria renal; en el tercio medio, es irrigado por ramas de la arteria gonadal, de la aorta abdominal y, en algunos casos, de la arteria ilíaca común; en el tercio inferior, la irrigación proviene principalmente de ramas de la arteria ilíaca interna, como la arteria vesical superior, arteria uterina en mujeres o la arteria vesical inferior en hombres.

Las ramas arteriales forman una red en la adventicia del uréter antes de penetrar hacia las capas internas. Esta irrigación segmentaria es importante clínicamente, especialmente en cirugías, ya que el uréter depende de múltiples fuentes vasculares a lo largo de su trayecto.`,
                                imagen: "./assets/planeamientos/uretroplastia/images/image9.png"
                            },
                            {
                                titulo: "Inervación",
                                contenido: `La inervación del uréter es proporcionada por fibras nerviosas del sistema nervioso autónomo, tanto simpáticas como parasimpáticas. Las fibras simpáticas provienen de los plexos renal, aórtico, hipogástrico superior e inferior, y tienen un papel en la modulación del dolor y del tono del músculo liso ureteral.

Las fibras parasimpáticas se originan principalmente en el nervio vago para la parte superior del uréter y en los nervios esplácnicos pélvicos (S2-S4) para el tercio inferior. La transmisión del dolor ureteral viaja a través de las fibras simpáticas hasta los ganglios espinales toracolumbares (T10-L2), lo que explica por qué el dolor por cólico renal puede irradiarse a la espalda, flanco, abdomen o incluso a los genitales.`,
                                imagen: "./assets/planeamientos/uretroplastia/images/image7.png"
                            },
                            {
                                titulo: "Drenaje linfático del uréter",
                                contenido: `El drenaje linfático del uréter sigue un patrón segmentario. La porción superior drena hacia los ganglios lumbares o paraaórticos; la porción media hacia los ganglios ilíacos comunes; y la porción inferior hacia los ganglios ilíacos internos, externos y sacros.

Este drenaje es importante en la diseminación de procesos infecciosos y tumorales, y debe considerarse durante la disección quirúrgica del uréter.`,
                                imagen: "./assets/planeamientos/uretroplastia/images/image4.png"
                            },
                            {
                                titulo: "Fisiología",
                                contenido: `La fisiología del uréter se basa en su función principal de transportar la orina desde la pelvis renal hasta la vejiga urinaria de manera continua y controlada. Este proceso se realiza mediante contracciones peristálticas del músculo liso ureteral, las cuales son rítmicas y espontáneas, iniciadas por células marcapaso ubicadas cerca de la pelvis renal.

Las ondas peristálticas se producen entre 1 y 5 veces por minuto, dependiendo del volumen de orina. El uréter está compuesto por una capa muscular con disposición longitudinal interna y circular externa, y una capa longitudinal externa en el tercio distal, lo que permite un movimiento eficaz de la orina. Su control es autónomo, con inervación simpática que regula el tono del músculo liso y transmite el dolor, e inervación parasimpática que estimula la actividad contráctil.

Además, el urotelio actúa como barrera impermeable y detecta el estiramiento, ayudando a regular las contracciones. Finalmente, en su porción terminal, el uréter atraviesa de forma oblicua la pared de la vejiga, formando un mecanismo valvular que evita el reflujo de orina hacia los uréteres cuando la vejiga se llena.`
                            }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta general", "Canasta vascular", "Canasta de tórax", "Separadores de vena", "Lima"],
                            equipos: ["Paquete de ropa", "Electro", "Pera", "Cauchos de succión", "Drenes en cigarrillo", "Compresas", "Guantes", "Sondas nasogástricas n 6-8", "Torundas", "Hojas de bisturí 20/15", "Gasas", "Apósitos"],
                            suturas: ["Nylon o monofilamento 2/0 o 3/0", "Sutura absorbible 2/0", "Poliglactina 910 1/0", "Catgut 4/0 5/0", "Sutura vascular 5/0 6/0 (reserva)"],
                            farmacos: ["Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/uretroplastia/images/image8.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/uretroplastia/images/image5.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito lateral", descripcion: "Decúbito lateral para facilitar el acceso al uréter y la reconstrucción ureteral.", imagen: "./assets/planeamientos/uretroplastia/images/image10.jpg", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/uretroplastia/images/image2.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general",
                    incision: { nombre: "Subcostal lateral", tipo: "Abordaje lateral subcostal", descripcion: "Abordaje abierto lateral para exponer el uréter y realizar la reparación." },
                    pasos: [
                        { paso: 1, tecnica: "Anestesia general", instrumental: ["Carrito de anestesia"] },
                        { paso: 2, tecnica: "Colocación de campos quirúrgicos e inicio de conteo de compresas y torundas", instrumental: ["Paquete de ropa", "Compresas-torundas"] },
                        { paso: 3, tecnica: "Incisión de piel y tejido celular subcutáneo con hemostasia", instrumental: ["Bisturí #4", "Hoja de bisturí #20", "Pinza Kelly", "Electrobisturí"] },
                        { paso: 4, tecnica: "Apertura de fascia, separación muscular y exposición retroperitoneal", instrumental: ["Separadores de Farabeuf", "Electrobisturí", "Separadores de Deaver"] },
                        { paso: 5, tecnica: "Localización y sección del uréter", instrumental: ["Tijeras de Metzenbaum", "Pinza de disección vascular"] },
                        { paso: 6, tecnica: "Reparación con dren en cigarrillo para localizar la estenosis", instrumental: ["Dren en cigarrillo"] }
                    ]
                }
            }
        },
        {
        id: 22,
        titulo: "Pieloplastia",
        tipo: "planeamiento-complejo",
        etapas: {
            planeacion: {
                objetivo: "Resecar la porción estrecha de la unión pieloureteral para realizar una anastomosis que permita el adecuado paso de la orina desde el riñón hacia la vejiga. Incluye la exposición de la unión pieloureteral y la colocación de un catéter doble J.",
                anatomia: {
                    titulo: "Anatomía y fisiología del uréter",
                    secciones: [
                        {
                            titulo: "Anatomía y fisiología",
                            contenido: `Los uréteres son tubos largos y delgados formados de músculo liso (25-30 cm). Transportan la orina desde la pelvis renal hasta la vejiga mediante ondas de contracción peristálticas continuas y controladas.`,
                            imagenes: ["./assets/planeamientos/pieloplastia-ureter/images/image3.jpg"]
                        },
                        {
                            titulo: "Capas",
                            contenido: `El uréter tiene tres capas: Mucosa (urotelio), Muscular (longitudinal interna y circular externa para peristaltismo) y Adventicia (tejido conectivo laxo con vasos y nervios).`,
                            imagen: "./assets/planeamientos/pieloplastia-ureter/images/image5.png",
                            large: true
                        },
                        {
                            titulo: "Irrigación del uréter",
                            contenido: `La irrigación es segmentaria: tercio superior (arteria renal), tercio medio (arteria gonadal y aorta) y tercio inferior (arterias ilíaca interna y vesicales).`,
                            imagen: "./assets/planeamientos/pieloplastia-ureter/images/image4.png"
                        },
                        {
                            titulo: "Inervación",
                            contenido: `Proporcionada por el sistema nervioso autónomo (plexos renal, aórtico e hipogástricos). El dolor renal se transmite por fibras simpáticas (T10-L2).`,
                            imagen: "./assets/planeamientos/pieloplastia-ureter/images/image7.png"
                        },
                        {
                            titulo: "Drenaje linfático",
                            contenido: `Segmentario hacia ganglios lumbares (superior), ilíacos comunes (medio) e ilíacos internos/externos (inferior).`,
                            imagen: "./assets/planeamientos/pieloplastia-ureter/images/image6.png"
                        }
                    ]
                },
                checklist: {
                    titulo: "Lista de chequeo",
                    categorias: {
                        instrumental: ["Canasta de Laparoscopia /Urología", "Canasta general", "Set de irrigación succión", "Electro de laparoscopia.", "Lente de 30° X 10 mm"],
                        equipos: ["Paquete de ropa", "Torre de laparoscopia", "Clip Hemolok 10mm y 5 Mm", "Catéter doble J 6x26.", "Caucho Succión", "Equipo de macrogoteo para irrigación", "Lápiz Electro", "Aguja de veress.", "3 Trocar De 5-10mm.", "Funda para la cámara"],
                        suturas: ["Piel: Polipropileno 2/0 o 3/0 con aguja ⅜ de circulo cortante con aguja de 27 mm.", "Pieloplastia: Polidioxanona o polipropileno 5/0 o 6/0 con aguja 1⁄2 circulo redonda"],
                        farmacos: ["Solución salina"]
                    }
                }
            },
            organizacion: {
                mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/pieloplastia-ureter/images/image9.png", large: true },
                mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/pieloplastia-ureter/images/image1.png", large: true },
                posicionPaciente: { 
                    titulo: "Posición del paciente", 
                    nombre: "Decúbito lateral", 
                    descripcion: "Permite la identificación facilitada de la pelvis renal debido a la hidronefrosis.", 
                    imagen: "./assets/planeamientos/pieloplastia-ureter/images/image10.jpg", 
                    large: true 
                },
                equipoQuirurgico: { 
                    titulo: "Ubicación del equipo quirúrgico", 
                    roles: [], 
                    imagen: "./assets/planeamientos/pieloplastia-ureter/images/image2.png", 
                    large: true 
                }
            },
            ejecucion: {
                anestesia: "Anestesia General",
                incision: { 
                    nombre: "Subcostal lateral", 
                    tipo: "Abordaje subcostal lateral", 
                    descripcion: "Abordaje subcostal lateral para la pieloplastia." 
                },
                pasos: [
                    { paso: 1, tecnica: "Se realiza neumoperitoneo con aguja de Veress a 15 mm hg y una técnica de tres trocares: un trocar de 12 mm para la óptica de 30 grados pararrectal y paraumbilical y 2 trocares de la región subcostal y la fosa ilíaca de 12 y 5 mm. la posición del crocar de 12 mm corresponde a la mano dominante del cirujano", instrumental: ["Aguja de veress.", "3 Trocar De 5-10mm.", "Lente de 30° X 10 mm", "Torre de laparoscopia"] },
                    { paso: 2, tecnica: "El acceso es directo a la unión pieloureteral, tanto a derecha como a izquierda. En el lado derecho se accede fácilmente a la zona del ángulo hepático del colon y en el lado izquierdo hacemos un acceso trans mesocólico, descrito previamente por nosotros.", instrumental: ["Canasta de Laparoscopia /Urología", "Canasta general", "Set de irrigación succión"] },
                    { paso: 3, tecnica: "No colocamos el catéter ureteral doble j previamente porque la hidronefrosis permite la facil identificación de la pelvis renal. se secciona el mesenterio del colon Y seca la pelvis ureteral y el uréter, logrando la fácil identificación y preservación de los vasos polares si existen.", instrumental: ["Electro de laparoscopia.", "Lápiz Electro", "Set de irrigación succión", "Caucho Succión"] },
                    { paso: 4, tecnica: "Antes de la sección de la pelvis renal colocamos una sutura de Prolene 2-0, con aguja recta, por vía percutánea, con lo cual traccionamos el borde medial de la pelvis, lo que facilitará la sutura posterior. Se secciona la pelvis renal en forma oblicua, separando el uréter, y si existen vasos polares la anastomosis se hará anterior a ellos. Se espátula el uréter por su cara lateral y se procede a la anastomosis del borde posterior.", instrumental: ["Pieloplastia: Polidioxanona o polipropileno 5/0 o 6/0 con aguja 1⁄2 circulo redonda", "Lápiz Electro", "Clip Hemolok 10mm y 5 Mm"] },
                    { paso: 5, tecnica: "En este momento se coloca el cateter doble j 6 FR por vía percutánea (se punciona la pared de la con la cánula venosa 14 G, a través de la cual se avanza una guía hidrofílica de forma anterógrada, sobre la cual se desliza el tutor ureteral)", instrumental: ["Catéter doble J 6x26.", "Equipo de macrogoteo para irrigación", "Funda para la cámara"] },
                    { paso: 6, tecnica: "Luego se realiza la sutura de la cara anterior, en ambos casos con Monocryl 4-0, con agua RB-1. Se deja drenaje aspirativo por contrabertura.", instrumental: ["Pieloplastia: Polidioxanona o polipropileno 5/0 o 6/0 con aguja 1⁄2 circulo redonda", "Paquete de ropa", "Caucho Succión"] },
                    { paso: 7, tecnica: "La Sonda vesical es retirada a las 24 horas y el drenaje al día siguiente si no hay filtración el tutor ureteral doble J se retira por cistoscopia flexible ambulatoria entre 2 y 4 semanas", instrumental: ["Catéter doble J 6x26.", "Paquete de ropa"] }
                ]
            }
        }
    }
    ,
    {
        id: 23,
        titulo: "Reimplante ureteral",
        tipo: "planeamiento-complejo",
        etapas: {
            planeacion: {
                objetivo: "El reimplante uretral es una cirugía que corrige el flujo de orina a través de los uréteres (conductos por donde la orina desciende desde el riñón hasta la vejiga)",
                anatomia: {
                    titulo: "Anatomía y fisiología del uréter",
                    secciones: [
                        {
                            titulo: "Anatomía y fisiología",
                            contenido: `Los uréteres son tubos largos y delgados formados de músculo liso. En los adultos, los uréteres miden 25-30 cm de largo, aproximadamente la longitud de una regla de 12 pulgadas.

Los uréteres empujan cada pequeña cantidad de orina en forma de ondas de contracción, a baja presión. En la vejiga, cada uréter atraviesa la pared de la vejiga por una abertura que se cierra cuando la vejiga se contrae para evitar que la orina retroceda.`,
                            imagenes: ["./assets/planeamientos/reimplante-ureteral/images/image1.jpg"]
                        },
                        {
                            titulo: "Capas",
                            contenido: `El uréter está compuesto por tres capas principales organizadas de adentro hacia afuera. La capa más interna es la mucosa, formada por un epitelio de transición (urotelio) que permite la distensión, y una lámina propia de tejido conectivo. Esta capa está en contacto directo con la orina. La siguiente es la capa muscular, compuesta por músculo liso dispuesto en dos capas: una longitudinal interna y una circular externa; en el tercio inferior del uréter puede haber una tercera capa longitudinal externa. Esta capa es responsable del movimiento peristáltico que impulsa la orina hacia la vejiga. Finalmente, la capa más externa es la adventicia, constituida por tejido conectivo laxo que contiene vasos sanguíneos, linfáticos y nervios, y que fija el uréter a las estructuras circundantes.`,
                            imagen: "./assets/planeamientos/reimplante-ureteral/images/image3.png",
                            large: true
                        },
                        {
                            titulo: "Irrigación uréter",
                            contenido: `La irrigación del uréter es segmentaria y proviene de varias arterias a lo largo de su trayecto desde el riñón hasta la vejiga. En el tercio superior, el uréter recibe ramas de la arteria renal; en el tercio medio, es irrigado por ramas de la arteria gonadal (testicular u ovárica), de la aorta abdominal y, en algunos casos, de la arteria iliaca común; en el tercio inferior, la irrigación proviene principalmente de ramas de la arteria iliaca interna, como la arteria vesical superior, arteria uterina en mujeres o la arteria vesical inferior en hombres. Las ramas arteriales forman una red en la adventicia del uréter antes de penetrar hacia las capas internas. Esta irrigación segmentaria es importante clínicamente, especialmente en cirugías, ya que el uréter depende de múltiples fuentes vasculares a lo largo de su trayecto.`,
                            imagen: "./assets/planeamientos/reimplante-ureteral/images/image2.png"
                        },
                        {
                            titulo: "Inervación",
                            contenido: `La inervación del uréter es proporcionada por fibras nerviosas del sistema nervioso autónomo, tanto simpáticas como parasimpáticas. Las fibras simpáticas provienen de los plexos renal, aórtico, hipogástrico superior e ,inferior, y tienen un papel en la modulación del dolor y del tono del músculo liso ureteral. Las fibras parasimpáticas se originan principalmente en el nervio vago (para la parte superior del uréter) y en los nervios esplácnicos pélvicos (S2-S4) para el tercio inferior. La transmisión del dolor ureteral viaja a través de las fibras simpáticas hasta los ganglios espinales toracolumbares (T10-L2), lo que explica por qué el dolor por cólico renal puede irradiarse a la espalda, flanco, abdomen o incluso a los genitales.`,
                            imagen: "./assets/planeamientos/reimplante-ureteral/images/image5.png"
                        },
                        {
                            titulo: "Drenaje Linfático uréter",
                            contenido: "",
                            imagen: "./assets/planeamientos/reimplante-ureteral/images/image4.png"
                        },
                        {
                            titulo: "FISIOLOGÍA",
                            contenido: `La fisiología del uréter se basa en su función principal de transportar la orina desde la pelvis renal hasta la vejiga urinaria de manera continua y controlada. Este proceso se realiza mediante contracciones peristálticas del músculo liso ureteral, las cuales son rítmicas y espontáneas, iniciadas por células marcapaso ubicadas cerca de la pelvis renal. Las ondas peristálticas se producen entre 1 y 5 veces por minuto, dependiendo del volumen de orina. El uréter está compuesto por una capa muscular con disposición longitudinal interna y circular externa (y una capa longitudinal externa en el tercio distal), lo que permite un movimiento eficaz de la orina. Su control es autónomo, con inervación simpática que regula el tono del músculo liso y transmite el dolor, e inervación parasimpática que estimula la actividad contráctil. Además, el urotelio, un epitelio de transición que recubre el interior del uréter, actúa como barrera impermeable y detecta el estiramiento, ayudando a regular las contracciones. Finalmente, en su porción terminal, el uréter atraviesa de forma oblicua la pared de la vejiga, formando un mecanismo valvular que evita el reflujo de orina hacia los uréteres cuando la vejiga se llena.`
                        }
                    ]
                },
                checklist: {
                    titulo: "Lista de chequeo",
                    categorias: {
                        instrumental: ["Canasta general", "Canasta vascular", "Canasta de tórax", "Separadores de vena", "Lima"],
                        equipos: ["Paquete de ropa", "Electrobisturí Pera", "Caucho de succión", "Dren en cigarrillo", "Compresas Guantes", "Sonda nasogástrica 6 y 8", "Torundas", "Hojas de bisturí 15 y 20", "Gasas", "Apósitos"],
                        suturas: ["Piel: Polipropileno 2/0 o 3/0 con aguja ⅜ de circulo cortante con aguja de 27 mm.", "TCS: Poliglactina 910 2/0 con aguja ½ circulo redonda de 27 mm", "Fascia y musculo: Poliglactina 910 1 o 0 con aguja ½ circulo redonda de 37 mm. Catgut cromado 4/0 o 5/0 con aguja 1⁄2 circulo redonda."],
                        farmacos: ["Solución salina"]
                    }
                }
            },
            organizacion: {
                mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/reimplante-ureteral/images/image8.png", large: true },
                mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/reimplante-ureteral/images/image9.png", large: true },
                posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Decúbito supino", imagen: "./assets/planeamientos/reimplante-ureteral/images/image11.png", large: true },
                equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/reimplante-ureteral/images/image6.png", large: true }
            },
            ejecucion: {
                anestesia: "Anestesia General",
                incision: { nombre: "incisión de Pfannestiel", tipo: "Incisión", descripcion: "incisión de Pfannestiel", imagen: "./assets/planeamientos/reimplante-ureteral/images/image10.png" },
                pasos: [
                    { paso: 1, tecnica: "Incisión Pfannenstiel aproximadamente de 2 cm por encima de la sínfisis del pubis", instrumental: ["Hojas de bisturí 15 y 20", "Electrobisturí Pera"] },
                    { paso: 2, tecnica: "Se incide la piel con el bisturí y el tejido celular subcutáneo con el electrobisturí para exponer la fascia del músculo recto que se separan en la línea media, es decir, de manera vertical.", instrumental: ["Hojas de bisturí 15 y 20", "Electrobisturí Pera", "Gasas"] },
                    { paso: 3, tecnica: "Se incide en la vejiga de manera vertical y en la cúpula vesical se introduce una gasa o compresa húmeda", instrumental: ["Hojas de bisturí 15 y 20", "Compresas Guantes", "Gasas"] },
                    { paso: 4, tecnica: "Se reposiciona el auto retractor para visualizar el trígono vesical, se identifican los meatos y se introduce una sonda de 4 fr y se fija a la mucosa vesical", instrumental: ["Canasta general", "Sonda nasogástrica 6 y 8"] },
                    { paso: 5, tecnica: "Se separa el uréter de la pared vesical alrededor del meato usando el electrobisturí y las tijeras", instrumental: ["Electrobisturí Pera", "Canasta general"] },
                    { paso: 6, tecnica: "Se movilizan completamente o una porción suficiente del uréter y se sutura el defecto.", instrumental: ["Canasta vascular", "TCS: Poliglactina 910 2/0 con aguja ½ circulo redonda de 27 mm"] },
                    { paso: 7, tecnica: "Creación del trayecto submucoso, Colocación del uréter, Reimplantación unilateral o bilateral", instrumental: ["Canasta de tórax", "Canasta vascular"] },
                    { paso: 8, tecnica: "El uréter se coloca en el ángulo superior del hiato que se ha ampliado previamente, se hace creación de un trayecto submucoso en dirección al cuello, creación de un nuevo trayecto submucoso y de un nuevo hiato", instrumental: ["Canasta vascular", "Separadores de vena"] },
                    { paso: 9, tecnica: "Introducción del uréter a través del nuevo hiato", instrumental: ["Canasta general", "Canasta vascular"] },
                    { paso: 10, tecnica: "Introducción del uréter en el trayecto submucoso", instrumental: ["Canasta general", "Canasta vascular"] },
                    { paso: 11, tecnica: "Inserción del uréter en su lugar de inicio y cierre del orificio mucoso", instrumental: ["Canasta vascular", "TCS: Poliglactina 910 2/0 con aguja ½ circulo redonda de 27 mm"] },
                    { paso: 12, tecnica: "Terminando de realizar la anastomosis, cerramos vejiga, primero sutura absorbible (3/0) para el segundo plano de la vejiga de igual manera. Sutura absorbible 3/0", instrumental: ["TCS: Poliglactina 910 2/0 con aguja ½ circulo redonda de 27 mm", "Fascia y musculo: Poliglactina 910 1 o 0 con aguja ½ circulo redonda de 37 mm. Catgut cromado 4/0 o 5/0 con aguja 1⁄2 circulo redonda."] },
                    { paso: 13, tecnica: "Colocamos drenes de contrabertura, aproximamos los músculos, cierre de fascia Poliglactina 910 2/0 o 1 Dren Simple 3/0 o sutura absorbible y monofilamento 3/0 para piel.", instrumental: ["Dren en cigarrillo", "Piel: Polipropileno 2/0 o 3/0 con aguja ⅜ de circulo cortante con aguja de 27 mm.", "Fascia y musculo: Poliglactina 910 1 o 0 con aguja ½ circulo redonda de 37 mm. Catgut cromado 4/0 o 5/0 con aguja 1⁄2 circulo redonda."] },
                    { paso: 14, tecnica: "Se deja sonda Foley por la uretra/cistostomía", instrumental: ["Sonda nasogástrica 6 y 8"] },
                    { paso: 15, tecnica: "Técnica de cohen: 1) Incisión del collarete mucoso 2) Disección ureteral 3) Creación del trayecto submucoso 4) Colocación del uréter 5) Reimplantación unilateral 6) Reimplantación bilateral", instrumental: ["Canasta general", "Canasta vascular"] },
                    { paso: 16, tecnica: "Técnica de transposición técnica de Glenn Anderson: 1) Técnica Glenn Anderson 2) Disección ureteral por vía endovesical 3) Disección de la mucosa alrededor del antiguo meato 4) El uréter se coloca en el ángulo superior del hiato que se ha ampliado de forma intencionada 5) Creación de un trayecto submucoso en dirección al cuello Aspecto final", instrumental: ["Canasta general", "Canasta vascular", "Separadores de vena"] },
                    { paso: 17, tecnica: "Técnica de politano - leadbetter: 1) Incisión del collarete mucoso 2) Disección ureteral 3) Creación del trayecto submucoso 4) Colocación del uréter 5) Reimplantación unilateral 6) Reimplantación bilateral", instrumental: ["Canasta general", "Canasta vascular"] }
                ]
            }
        }
    }
    ],


    "Vejiga": [
        {
            id: 9,
            titulo: "Cistopexia",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "El objetivo quirúrgico es la fijación quirúrgica de la vejiga urinaria a la pared abdominal u otra estructura anatómica, por lo general como tratamiento de un cistocele.",
                    anatomia: {
                        titulo: "ANATOMÍA",
                        secciones: [
                            {
                                titulo: "Descripción general",
                                contenido: `La vejiga es un órgano muscular hueco y distensible, situado en la cavidad pelviana, por detrás de la sínfisis del pubis. En los hombres, se encuentra por delante del recto y en la mujer es anterior a la vagina e inferior al útero. Con una capacidad de la vejiga oscila en promedio entre 700 y 800 Ml.`,
                                imagen: "./assets/planeamientos/cistopexia/images/image3.png"
                            },
                            {
                                titulo: "La vejiga posee 3 porciones",
                                contenido: `* Cuerpo: Dónde la orina es recolectada.
* Fondo (Base): Contiene al trígono vesical.
* Trígono Vesical:  Donde se localiza la uretra.
A su vez se compone por 3 capas:

* Capa Serosa:  Se compone de tejido conectivo alveolar.
* Capa Muscular: Formada por 3 capas de fibras musculares lisas: Longitudinal interna, circular media, longitudinal externa.
* Capa Mucosa:  Compuesta por epitelio de transición y una lámina propia subyacente.`,
                                imagen: "./assets/planeamientos/cistopexia/images/image5.png"
                            },
                            {
                                titulo: "Relaciones de la vejiga",
                                contenido: `* PARTE ANTERIOR:
* Sínfisis del pubis
* Espacio prevesical de Retzius.
* Músculos de la pared abdominal
* Fascia umbilicoprevesical
* Uraco
* Vasos umbilicales obliterados

* PARTE INFERIOR:
* Músculo elevador del ano
* Músculos internos de la pelvis

* PARTE POSTERIOR:
* Tiene el fondo de saco vésico rectal de Douglas y la Ampolla rectal.

* PARTE SUPERIOR:
* Uréteres, Conductos Deferentes y Vesículas Seminales.`
                            }
                        ]
                    },
                    irrigacion: {
                        titulo: "IRRIGACIÓN E INERVACIÓN",
                        contenido: `Es drenada por las venas ilíacas internas, y tanto en hombres como en mujeres, los vasos linfáticos de las caras supero laterales de la vejiga desembocan en los ganglios linfáticos ilíacos externos

INERVACION
      Involucra el sistema nervioso simpático y parasimpático

1. Las fibras simpáticas presinápticas para la vejiga urinaria son conducidas desde los niveles torácicos inferiores y lumbares superiores de la médula espinal a través de los nervios esplácnicos lumbares pasando por el tronco simpático lumbar, plexo hipogástrico superior y nervios hipogástricos hacia los plexos vesicales (pélvicos). Es un subplexo del plexo hipogástrico inferior, de ahí envían fibras autónomas postsinápticas a las paredes de la vejiga urinaria.
2. Las fibras parasimpáticas presinápticas para la vejiga urinaria se originan en las neuronas de los segmentos sacros de la médula espinal S2-S4 y pasan desde los  ramos  anteriores de los nervios espinales  sacros ,a  través de los  nervios esplénicos pélvicos  y los  plexos hipogástricos inferiores, hasta la  vejiga urinaria.`,
                        imagenes: [
                            "./assets/planeamientos/cistopexia/images/image4.png",
                            "./assets/planeamientos/cistopexia/images/image11.png"
                        ]
                    },
                    fisiologia: {
                        titulo: "FISIOLOGÍA",
                        contenido: `Los músculos de la vejiga que permiten el control voluntario de la micción y permiten 2 funciones: 1) la sensación que permite que reconozcas que tu vejiga está llena y debe ser vaciada y 2) el control motor que permite que puedas orinar voluntariamente.
Primero, como la pared vesical se estira cuando está llena o próxima a su máxima capacidad, existen señales que son transmitidas a través del sistema nervioso parasimpático para contraer el músculo detrusor, el cual es una capa de la pared vesical constituida por fibras de músculo liso que son ordenadas en fascículos longitudinales, circulares o en espiral, esta señal estimulará a la vejiga para expulsar orina a través de la uretra, luego, estas sensaciones dentro de la vejiga serán transmitidas al sistema nervioso central (SNC) por medio de fibras aferentes viscerales generales (AVG). Mientras las fibras aferentes en la cara superior de la vejiga siguen el curso de los nervios simpáticos eferentes hasta el SNC, las fibras aferentes en la porción inferior siguen a las fibras parasimpáticas eferentes.`,
                        funciones: [],
                        imagenes: ["./assets/planeamientos/cistopexia/images/image8.png"]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Equipo general"],
                            equipos: ["Paquete de ropa", "Sonda Foley 16-18", "Jeringa de 10 cc", "Gasas", "Caucho de succión", "Asepto jeringa", "Torundas", "Hoja de bisturí 15- 20", "Lapicero de electrobisturí", "Guantes", "Cistofló"],
                            suturas: ["PIEL: Polipropileno 3/0 aguja curva cortante ⅜ de circulo", "FASCIA: Poliglactin 0 o 1 aguja curva redonda de ½ de circulo", "SUSPENSIÓN DE LA VEJIGA: Polipropileno 1 aguja redonda de ½ circulo"],
                            farmacos: ["Solución salina", "Lidocaina al 1%, 5cc"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/cistopexia/images/image1.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/cistopexia/images/image6.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Litotomía o Decúbito supino", descripcion: "", imagen: "./assets/planeamientos/cistopexia/images/image9.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/cistopexia/images/image14.jpg", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general",
                    anestesiaImagen: "./assets/planeamientos/cistopexia/images/image12.png",
                    incision: { nombre: "Incisión Pfannenstiel", tipo: "Abordaje Pfannenstiel", descripcion: "La incisión es una Pfannenstiel, aunque dependiendo de la técnica (abierta, laparoscópica o con malla)." },
                    pasos: [
                        { paso: 1, tecnica: "Incisión abdominal Pfannestiel.", instrumental: ["Mango de bisturí 4", "Hoja de bisturí 20"] },
                        { paso: 2, tecnica: "Visualización de la aponeurosis de los músculos rectos anteriores.", instrumental: ["Separadores de Farabeuf", "Electrobisturí"] },
                        { paso: 3, tecnica: "Toma de la aponeurosis de los músculos rectos.", instrumental: ["Pinza de Allix"] },
                        { paso: 4, tecnica: "Ampliación de la aponeurosis.", instrumental: ["Tijeras de Metzembaum", "Lapicero del electrobisturí"] },
                        { paso: 5, tecnica: "TÉCNICA BURSH: Se llega a peritoneo parietal; se rechaza y se ubican los separadores con el fin de visualizar mejor la vejiga.", instrumental: ["Separador abdominal de Balfour", "O'sullivan", "O'connor", "Deaver angosto", "Valva maleable ancha", "Compresas abdominales húmedas"] },
                        { paso: 6, tecnica: "Se ingresa al espacio de Retzus por medio de disección roma con el fin de exponer los espacios paravesicales y la pared vaginal anterior.", instrumental: ["Pinza Rochester recta", "Torunda mediana húmeda"] },
                        { paso: 7, tecnica: "Se expone el ligamento de Cooper separándolo de la sínfisis posterior.", instrumental: ["Pinza de disección sin garra", "Tijera de Metzembaum"] },
                        { paso: 8, tecnica: "Con dos dedos en la vagina el cirujano empuja la pared vaginal hacia ambos lados en dirección al ligamento. Se diseca por la parte abdominal la pared vaginal.", instrumental: ["Pinza Rochester recta", "Torunda mediana húmeda"] },
                        { paso: 9, tecnica: "El cirujano extrae la mano de la vagina, se cambia de guante; ya que esta zona se considera contaminada.", instrumental: ["Guante"] },
                        { paso: 10, tecnica: "Después de cambiarse el guante procede a anudar los puntos; la uretra y el cuello deben apoyar cómodamente contra el ligamento; aquí el cirujano tiene en cuenta cuanta suspensión ha de hacerse para que la paciente no quede demasiado continente.", instrumental: ["Poliéster 0 aguja 1/2 círculo redonda", "Polipropileno 0 aguja 1/2 círculo redonda"] },
                        { paso: 11, tecnica: "Se cortan los puntos un poco largos (1 cm).", instrumental: ["Tijera de mayo"] },
                        { paso: 12, tecnica: "Se lava la cavidad abdominal y se retiran los separadores abdominales.", instrumental: ["Coca", "Cánula de Yankawer", "Pera", "Caucho de succión", "Solución fisiológica tibia y agua"] },
                        { paso: 13, tecnica: "Se revisa hemostasia y se realiza el recuento de compresas.", instrumental: ["Lapicero de electrobisturí", "Pinza Foerster"] },
                        { paso: 14, tecnica: "Se visualiza y se sutura la aponeurosis de los músculos rectos anteriores.", instrumental: ["Separador de Farabeuf", "Pinza de disección con garra", "Portaagujas mediano", "Tijera de Mayo recta", "Poliglactín 910 0 aguja 1/2 círculo grande redonda"] },
                        { paso: 15, tecnica: "Lavado del tejido graso.", instrumental: ["Coca", "Suero fisiológico"] },
                        { paso: 16, tecnica: "Revisión de hemostasia del tejido graso.", instrumental: ["Lapicero de electrobisturí"] },
                        { paso: 17, tecnica: "Sutura de piel.", instrumental: ["Pinza de disección con garra", "Portaagujas pequeño", "Tijera de mayo", "Poliamida o polipropileno 2/0 o 3/0 aguja 3/8 círculo cortante"] },
                        { paso: 18, tecnica: "Curación.", instrumental: ["Apósito"] }
                    ]
                }
            }
        },
        {
            id: 37,
            titulo: "Cistectomía total",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Resección de la vejiga urinaria de forma radical. La condición más común para realizar esta cirugía es el cáncer.",
                    anatomia: {
                        titulo: "ANATOMÍA",
                        secciones: [
                            {
                                titulo: "Descripción general",
                                contenido: `La vejiga es un órgano muscular hueco y distensible, situado en la cavidad pelviana, por detrás de la sínfisis del pubis. En los hombres, se encuentra por delante del recto y en la mujer es anterior a la vagina e inferior al útero. Con una capacidad de la vejiga oscila en promedio entre 700 y 800 Ml.`,
                                imagen: "./assets/planeamientos/cistectomia_total/images/image11.png"
                            },
                            {
                                titulo: "La vejiga posee 3 porciones",
                                contenido: `* Cuerpo: Dónde la orina es recolectada.
* Fondo (Base): Contiene al trígono vesical.
* Trígono Vesical:  Donde se localiza la uretra.
A su vez se compone por 3 capas:

* Capa Serosa:  Se compone de tejido conectivo alveolar.
* Capa Muscular: Formada por 3 capas de fibras musculares lisas: Longitudinal interna, circular media, longitudinal externa.
* Capa Mucosa:  Compuesta por epitelio de transición y una lámina propia subyacente.`,
                                imagen: "./assets/planeamientos/cistectomia_total/images/image8.png"
                            },
                            {
                                titulo: "Relaciones de la vejiga",
                                contenido: `* PARTE ANTERIOR:
* Sínfisis del pubis
* Espacio prevesical de Retzius.
* Músculos de la pared abdominal
* Fascia umbilicoprevesical
* Uraco
* Vasos umbilicales obliterados

* PARTE INFERIOR:
* Músculo elevador del ano
* Músculos internos de la pelvis

* PARTE POSTERIOR:
* Tiene el fondo de saco vésico rectal de Douglas y la Ampolla rectal.

* PARTE SUPERIOR:
* Uréteres, Conductos Deferentes y Vesículas Seminales.`
                            }
                        ]
                    },
                    irrigacion: {
                        titulo: "IRRIGACIÓN E INERVACIÓN",
                        contenido: `Es drenada por las venas ilíacas internas, y tanto en hombres como en mujeres, los vasos linfáticos de las caras supero laterales de la vejiga desembocan en los ganglios linfáticos ilíacos externos

INERVACION
      Involucra el sistema nervioso simpático y parasimpático

1. Las fibras simpáticas presinápticas para la vejiga urinaria son conducidas desde los niveles torácicos inferiores y lumbares superiores de la médula espinal a través de los nervios esplácnicos lumbares pasando por el tronco simpático lumbar, plexo hipogástrico superior y nervios hipogástricos hacia los plexos vesicales (pélvicos). Es un subplexo del plexo hipogástrico inferior, de ahí envían fibras autónomas postsinápticas a las paredes de la vejiga urinaria.
2. Las fibras parasimpáticas presinápticas para la vejiga urinaria se originan en las neuronas de los segmentos sacros de la médula espinal S2-S4 y pasan desde los  ramos  anteriores de los nervios espinales  sacros ,a  través de los  nervios esplénicos pélvicos  y los  plexos hipogástricos inferiores, hasta la  vejiga urinaria.`,
                        imagenes: [
                            "./assets/planeamientos/cistectomia_total/images/image7.png",
                            "./assets/planeamientos/cistectomia_total/images/image10.png"
                        ]
                    },
                    fisiologia: {
                        titulo: "FISIOLOGÍA",
                        contenido: `Los músculos de la vejiga que permiten el control voluntario de la micción y permiten 2 funciones: 1) la sensación que permite que reconozcas que tu vejiga está llena y debe ser vaciada y 2) el control motor que permite que puedas orinar voluntariamente.
Primero, como la pared vesical se estira cuando está llena o próxima a su máxima capacidad, existen señales que son transmitidas a través del sistema nervioso parasimpático para contraer el músculo detrusor, el cual es una capa de la pared vesical constituida por fibras de músculo liso que son ordenadas en fascículos longitudinales, circulares o en espiral, esta señal estimulará a la vejiga para expulsar orina a través de la uretra, luego, estas sensaciones dentro de la vejiga serán transmitidas al sistema nervioso central (SNC) por medio de fibras aferentes viscerales generales (AVG). Mientras las fibras aferentes en la cara superior de la vejiga siguen el curso de los nervios simpáticos eferentes hasta el SNC, las fibras aferentes en la porción inferior siguen a las fibras parasimpáticas eferentes.`,
                        funciones: [],
                        imagenes: ["./assets/planeamientos/cistectomia_total/images/image9.png"]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Equipo de general", "Equipo vascular", "Clamps Intestinales"],
                            equipos: ["Paquete de ropa", "Sonda Foley 22 x 30", "Jeringa de 20 cc", "Gasas", "Caucho de succión", "Asepto jeringa", "Torundas", "Hoja de bisturí 15- 20", "Lapicero de electro", "bisturí", "Guantes", "Cistofló", "Equipo de venoclisis", "Sonda nelaton", "Ligasure"],
                            suturas: ["PIEL: Polipropileno 3/0 aguja curva cortante 3/8 de circulo", "TCS: Catgut cromado 3/0 aguja redonda medio círculo.", "FASCIA: Poliglactin 0 o 1 aguja curva redonda de 1/2 de círculo", "Seda 2/0 o 3/0 precortadas", "Poliglactina 910 3/0 para anastomosis"],
                            farmacos: ["Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/cistectomia_total/images/image6.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/cistectomia_total/images/image1.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino con ligero Trendelenburg", descripcion: "Posición del paciente en decúbito supino con ligero Trendelenburg.", imagen: "./assets/planeamientos/cistectomia_total/images/image2.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/cistectomia_total/images/image3.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general",
                    anestesiaImagen: "./assets/planeamientos/cistectomia_total/images/image4.png",
                    incision: { nombre: "Incisión mediana infraumbilical", tipo: "Abordaje mediano", descripcion: "Incisión en línea media desde la sínfisis del pubis hasta la proximidad del epigastrio." },
                    pasos: [
                        { paso: 1, tecnica: "Incisión en línea media desde la sínfisis del pubis hasta la proximidad del epigastrio", instrumental: ["Mango de bisturí 3", "Hoja de bisturí 15"] },
                        { paso: 2, tecnica: "Se incide el peritoneo y se levanta en tienda de campaña para acceder a la cavidad peritoneal", instrumental: ["Tijera de Metzenbaum", "Pinzas", "Electrobisturí"] },
                        { paso: 3, tecnica: "El peritoneo posterior es abierto sobre los vasos ilíacos para exponer los uréteres", instrumental: ["Separador Deaver"] },
                        { paso: 4, tecnica: "Se disecan ambos uréteres hacia la pelvis hasta su entrada en vejiga", instrumental: ["Electrobisturí"] },
                        { paso: 5, tecnica: "Se diseca el pedículo vascular lateral vesical, distal a la arteria hipogástrica", instrumental: ["Disección vascular"] },
                        { paso: 6, tecnica: "Se realiza una incisión horizontal sobre el saco de Douglas mientras se tracciona la vejiga en sentido anterior", instrumental: [] },
                        { paso: 7, tecnica: "Una vez la vejiga ha sido liberada de su plano posterior, se incide a nivel del cuello vesical para su exéresis", instrumental: [] },
                        { paso: 8, tecnica: "Se cierra la uretra y se coloca drenaje en el lecho quirúrgico", instrumental: ["Ác. poliglicólico (DEXON) del 0 y de 2/0", "Jackson-Pratt"] }
                    ]
                }
            }
        },
        {
            id: 24,
            titulo: "Cistectomía radical",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Resección de la vejiga urinaria de forma radical. La condición más común para realizar esta cirugía es el cáncer.",
                    anatomia: {
                        titulo: "ANATOMÍA",
                        secciones: [
                            {
                                titulo: "Descripción general",
                                contenido: `La vejiga es un órgano muscular hueco y distensible, situado en la cavidad pelviana, por detrás de la sínfisis del pubis. En los hombres, se encuentra por delante del recto y en la mujer es anterior a la vagina e inferior al útero. Con una capacidad de la vejiga oscila en promedio entre 700 y 800 Ml.`,
                                imagen: "./assets/planeamientos/cistectomia-radical/images/image12.png"
                            },
                            {
                                titulo: "La vejiga posee 3 porciones",
                                contenido: `* Cuerpo: Dónde la orina es recolectada.
* Fondo (Base): Contiene al trígono vesical.
* Trígono Vesical:  Donde se localiza la uretra. 
A su vez se compone por 3 capas:

* Capa Serosa:  Se compone de tejido conectivo alveolar.
* Capa Muscular: Formada por 3 capas de fibras musculares lisas: Longitudinal interna, circular media, longitudinal externa.
* Capa Mucosa:  Compuesta por epitelio de transición y una lámina propia subyacente.`,
                                imagen: "./assets/planeamientos/cistectomia-radical/images/image9.png"
                            },
                            {
                                titulo: "Relaciones de la vejiga",
                                contenido: `* PARTE ANTERIOR:
* Sínfisis del pubis
* Espacio prevesical de Retzius.
* Músculos de la pared abdominal
* Fascia umbilicoprevesical
* Uraco
* Vasos umbilicales obliterados

* PARTE INFERIOR:
* Músculo elevador del ano
* Músculos internos de la pelvis

* PARTE POSTERIOR:
* Tiene el fondo de saco vésico rectal de Douglas y la Ampolla rectal.

* PARTE SUPERIOR:
* Uréteres, Conductos Deferentes y Vesículas Seminales.`
                            }
                        ]
                    },
                    irrigacion: {
                        titulo: "IRRIGACIÓN E INERVACIÓN",
                        contenido: `Es drenada por las venas ilíacas internas, y tanto en hombres como en mujeres, los vasos linfáticos de las caras supero laterales de la vejiga desembocan en los ganglios linfáticos ilíacos externos

INERVACION
      Involucra el sistema nervioso simpático y parasimpático 
  
1. Las fibras simpáticas presinápticas para la vejiga urinaria son conducidas desde los niveles torácicos inferiores y lumbares superiores de la médula espinal a través de los nervios esplácnicos lumbares pasando por el tronco simpático lumbar, plexo hipogástrico superior y nervios hipogástricos hacia los plexos vesicales (pélvicos). Es un subplexo del plexo hipogástrico inferior, de ahí envían fibras autónomas postsinápticas a las paredes de la vejiga urinaria.
2. Las fibras parasimpáticas presinápticas para la vejiga urinaria se originan en las neuronas de los segmentos sacros de la médula espinal S2-S4 y pasan desde los  ramos  anteriores de los nervios espinales  sacros ,a  través de los  nervios esplénicos pélvicos  y los  plexos hipogástricos inferiores, hasta la  vejiga urinaria.`,
                        imagenes: [
                            "./assets/planeamientos/cistectomia-radical/images/image8.png",
                            "./assets/planeamientos/cistectomia-radical/images/image11.png"
                        ]
                    },
                    fisiologia: {
                        titulo: "FISIOLOGÍA",
                        contenido: `Los músculos de la vejiga que permiten el control voluntario de la micción y permiten 2 funciones: 1) la sensación que permite que reconozcas que tu vejiga está llena y debe ser vaciada y 2) el control motor que permite que puedas orinar voluntariamente.
Primero, como la pared vesical se estira cuando está llena o próxima a su máxima capacidad, existen señales que son transmitidas a través del sistema nervioso parasimpático para contraer el músculo detrusor, el cual es una capa de la pared vesical constituida por fibras de músculo liso que son ordenadas en fascículos longitudinales, circulares o en espiral, esta señal estimulará a la vejiga para expulsar orina a través de la uretra, luego, estas sensaciones dentro de la vejiga serán transmitidas al sistema nervioso central (SNC) por medio de fibras aferentes viscerales generales (AVG). Mientras las fibras aferentes en la cara superior de la vejiga siguen el curso de los nervios simpáticos eferentes hasta el SNC, las fibras aferentes en la porción inferior siguen a las fibras parasimpáticas eferentes.`,
                        funciones: [],
                        imagenes: ["./assets/planeamientos/cistectomia-radical/images/image10.png"]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Equipo de general", "Equipo vascular", "Clamps Intestinales"],
                            equipos: ["Paquete de ropa", "Sonda Foley 22 x 30", "Jeringa de 20 cc", "Gasas", "Caucho de succión", "Asepto jeringa", "Torundas", "Hoja de bisturí 15- 20", "Lapicero de electro", "bisturí", "Guantes", "Cistofló", "Equipo de venoclisis", "Sonda nelaton", "Ligasure", "Frascos de patología"],
                            suturas: ["PIEL: Polipropileno 3/0 aguja curva cortante 3/8 de circulo", "TCS: Catgut cromado 3/0 aguja redonda medio círculo.", "FASCIA: Poliglactin 0 o 1 aguja curva redonda de 1/2 de círculo", "Seda 2/0 o 3/0 precortadas", "Poliglactina 910 3/0 para anastomosis"],
                            farmacos: ["Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/cistectomia-radical/images/image6.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/cistectomia-radical/images/image7.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Posición de Litotomía + Trendelenburg", descripcion: "Posición de Litotomía + Trendelenburg", imagen: "./assets/planeamientos/cistectomia-radical/images/image1.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/cistectomia-radical/images/image5.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general o raquídea",
                    anestesiaImagen: "./assets/planeamientos/cistectomia-radical/images/image4.png",
                    incision: { nombre: "Incisión mediana infraumbilical", tipo: "Abordaje abdominal abdominopélvico abierto", descripcion: "Abordaje abdominal abdominopélvico abierto : Incisión mediana infraumbilical" },
                    pasos: [
                        { paso: 1, tecnica: "Incisión en línea media infraumbilical", instrumental: ["mango de bisturí 3", "hoja de bisturí 15"] },
                        { paso: 2, tecnica: "Se incide la fascia muscular del recto verticalmente", instrumental: ["Tijera de Mayo"] },
                        { paso: 3, tecnica: "Se rechazan a los rectos lateralmente por su línea media. Incisión de la vaina posterior de los rectos hasta acceder al peritoneo y grasa preperitoneal.", instrumental: ["Separadores", "Bisturí"] },
                        { paso: 4, tecnica: "Se realiza una cuidadosa y sistemática inspección de la cavidad abdominal, para evaluar la presencia de metástasis hepáticas o adenopatías retroperitoneales.", instrumental: [] },
                        { paso: 5, tecnica: "Se moviliza el ciego y colon derecho medialmente, realizando una incisión de la línea blanca de Toldt y peritoneo posterior que permita liberar al intestino de sus adherencias retroperitoneales cranealmente, hacia el ligamento de Treitz.", instrumental: ["Mango de bisturí 4", "Tijeras de Metzembaum"] },
                        { paso: 6, tecnica: "Se desplazan hacia el epigastrio el paquete de asas intestinales y el colon derecho, cubriéndolos con paños verdes humedecidos que ayudan a contenerlas cranealmente", instrumental: ["separador de Bookwalter"] },
                        { paso: 7, tecnica: "Se disecan ambos uréteres. Su disección se prolonga cuidadosamente hacia la pelvis hasta su entrada en vejiga.", instrumental: ["Tijeras de Metzembaum"] },
                        { paso: 8, tecnica: "Se realiza la linfadenectomía", instrumental: ["Tijeras de Metzembaum", "Electrobisturí"] },
                        { paso: 9, tecnica: "Se diseca el pedículo vascular lateral vesical, de localización distal a la arteria hipogástrica.", instrumental: ["ác. poliglicólico (DEXON®) del 0 o del 2 o con sellado vascular LIGASURE® STD."] },
                        { paso: 10, tecnica: "La arteria hipogástrica puede ser ligada distal a la salida de la arteria glútea, sin seccionarse.", instrumental: ["LIGASURE"] },
                        { paso: 11, tecnica: "El peritoneo posterior se incide lateralmente en ambos lados desde los vasos iliacos hacia el canal femoral como límite lateral de resección que se extirpará con la pieza.", instrumental: ["Tijeras de Metzembaum", "Mango de bisturí 4", "Electrobisturí"] },
                        { paso: 12, tecnica: "Disección apical: En los hombres, generalmente consiste en extirpar la próstata y las vesículas seminales.", instrumental: ["Tijeras de Metzembaum", "Electrobisturí"] },
                        { paso: 13, tecnica: "Cistectomía radical en la mujer: En las mujeres, la cistectomía radical implica extirpar el útero, los ovarios y parte de la vagina.", instrumental: ["Tijeras de Metzembaum", "Electrobisturí"] }
                    ]
                }
            }
        }
        ,
        {
            id: 25,
            titulo: "Cistectomía parcial",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Procedimiento mediante el cual se extirpa parte de la vejiga y se reconstruye de nuevo, preservando la integridad vesical como reservorio de la orina.",
                    anatomia: {
                        titulo: "ANATOMÍA",
                        secciones: [
                            {
                                titulo: "Descripción general",
                                contenido: `La vejiga es un órgano muscular hueco y distensible, situado en la cavidad pelviana, por detrás de la sínfisis del pubis. En los hombres, se encuentra por delante del recto y en la mujer es anterior a la vagina e inferior al útero. Con una capacidad de la vejiga oscila en promedio entre 700 y 800 Ml.`,
                                imagen: "./assets/planeamientos/cistectomia-parcial/images/image12.png"
                            },
                            {
                                titulo: "La vejiga posee 3 porciones",
                                contenido: `* Cuerpo: Dónde la orina es recolectada.
* Fondo (Base): Contiene al trígono vesical.
* Trígono Vesical:  Donde se localiza la uretra.
A su vez se compone por 3 capas:

* Capa Serosa:  Se compone de tejido conectivo alveolar.
* Capa Muscular: Formada por 3 capas de fibras musculares lisas: Longitudinal interna, circular media, longitudinal externa.
* Capa Mucosa:  Compuesta por epitelio de transición y una lámina propia subyacente.`,
                                imagen: "./assets/planeamientos/cistectomia-parcial/images/image8.png"
                            },
                            {
                                titulo: "Relaciones de la vejiga",
                                contenido: `* PARTE ANTERIOR:
* Sínfisis del pubis
* Espacio prevesical de Retzius.
* Músculos de la pared abdominal
* Fascia umbilicoprevesical
* Uraco
* Vasos umbilicales obliterados

* PARTE INFERIOR:
* Músculo elevador del ano
* Músculos internos de la pelvis

* PARTE POSTERIOR:
* Tiene el fondo de saco vésico rectal de Douglas y la Ampolla rectal.

* PARTE SUPERIOR:
* Uréteres, Conductos Deferentes y Vesículas Seminales.`
                            }
                        ]
                    },
                    irrigacion: {
                        titulo: "IRRIGACIÓN E INERVACIÓN",
                        contenido: `Es drenada por las venas ilíacas internas, y tanto en hombres como en mujeres, los vasos linfáticos de las caras supero laterales de la vejiga desembocan en los ganglios linfáticos ilíacos externos\n\nINERVACION\n      Involucra el sistema nervioso simpático y parasimpático\n\n1. Las fibras simpáticas presinápticas para la vejiga urinaria son conducidas desde los niveles torácicos inferiores y lumbares superiores de la médula espinal a través de los nervios esplácnicos lumbares pasando por el tronco simpático lumbar, plexo hipogástrico superior y nervios hipogástricos hacia los plexos vesicales (pélvicos). Es un subplexo del plexo hipogástrico inferior, de ahí envían fibras autónomas postsinápticas a las paredes de la vejiga urinaria.\n2. Las fibras parasimpáticas presinápticas para la vejiga urinaria se originan en las neuronas de los segmentos sacros de la médula espinal S2-S4 y pasan desde los  ramos  anteriores de los nervios espinales  sacros ,a  través de los  nervios esplénicos pélvicos  y los  plexos hipogástricos inferiores, hasta la  vejiga urinaria.`,
                        imagenes: [
                            "./assets/planeamientos/cistectomia-parcial/images/image7.png",
                            "./assets/planeamientos/cistectomia-parcial/images/image11.png"
                        ]
                    },
                    fisiologia: {
                        titulo: "FISIOLOGÍA",
                        contenido: `Los músculos de la vejiga que permiten el control voluntario de la micción y permiten 2 funciones: 1) la sensación que permite que reconozcas que tu vejiga está llena y debe ser vaciada y 2) el control motor que permite que puedas orinar voluntariamente.
Primero, como la pared vesical se estira cuando está llena o próxima a su máxima capacidad, existen señales que son transmitidas a través del sistema nervioso parasimpático para contraer el músculo detrusor, el cual es una capa de la pared vesical constituida por fibras de músculo liso que son ordenadas en fascículos longitudinales, circulares o en espiral, esta señal estimulará a la vejiga para expulsar orina a través de la uretra, luego, estas sensaciones dentro de la vejiga serán transmitidas al sistema nervioso central (SNC) por medio de fibras aferentes viscerales generales (AVG). Mientras las fibras aferentes en la cara superior de la vejiga siguen el curso de los nervios simpáticos eferentes hasta el SNC, las fibras aferentes en la porción inferior siguen a las fibras parasimpáticas eferentes.`,
                        funciones: [],
                        imagenes: ["./assets/planeamientos/cistectomia-parcial/images/image10.png"]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Equipo de general", "Equipo vascular", "Clamps Intestinales"],
                            equipos: [
                                "Paquete de ropa",
                                "Sonda Foley 22 x 30",
                                "Jeringa de 20 cc",
                                "Gasas",
                                "Caucho de succión",
                                "Asepto jeringa",
                                "Torundas",
                                "Hoja de bisturí #15- #20",
                                "Lapicero de electrobisturí",
                                "Guantes",
                                "Cistofló",
                                "Equipo de venoclisis",
                                "Sonda nelaton"
                            ],
                            suturas: [
                                "PIEL: Polipropileno 3/0 aguja curva cortante 3/8 de círculo",
                                "TCS: Catgut cromado 3/0 aguja redonda medio círculo",
                                "FASCIA: Poliglactin 0 o 1 aguja curva redonda de 1/2 de círculo",
                                "Seda 2/0 o 3/0 precortadas",
                                "Poliglactina 910 3/0 para anastomosis"
                            ],
                            farmacos: ["Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/cistectomia-parcial/images/image1.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/cistectomia-parcial/images/image9.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino con un ligero Trendelenburg", descripcion: "Decúbito supino con un ligero Trendelenburg", imagen: "./assets/planeamientos/cistectomia-parcial/images/image6.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/cistectomia-parcial/images/image2.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general o raquídea",
                    anestesiaImagen: "./assets/planeamientos/cistectomia-parcial/images/image4.png",
                    incision: { nombre: "Incisión en línea media desde la sínfisis del pubis hasta la proximidad del ombligo", tipo: "Abordaje mediano", descripcion: "Incisión en línea media infraumbilical" },
                    pasos: [
                        { paso: 1, tecnica: "Incisión en línea media desde la sínfisis del pubis hasta la proximidad del ombligo", instrumental: ["Mango de bisturí 3", "Hoja de bisturí 15"] },
                        { paso: 2, tecnica: "Se incide la fascia muscular del recto verticalmente", instrumental: ["Tijera de Mayo"] },
                        { paso: 3, tecnica: "Para ello se abre el peritoneo próximo al ombligo, en dirección vertical.", instrumental: ["Electrobisturí"] },
                        { paso: 4, tecnica: "Se colocan dos suturas de referencia sobre la pared vesical alejadas de la localización del tumor.", instrumental: ["Suturas"] },
                        { paso: 5, tecnica: "Se aísla la vejiga de los bordes de la herida mediante cubiertas plásticas para reducir el riesgo de un implante tumoral.", instrumental: ["Cubiertas plásticas estériles"] },
                        { paso: 6, tecnica: "Se abre la vejiga entre las suturas mediante una incisión longitudinal", instrumental: ["Electrobisturí", "Allix"] },
                        { paso: 7, tecnica: "Se localiza el tumor en la mucosa vesical", instrumental: [] },
                        { paso: 8, tecnica: "Se realiza una incisión circunferencial alrededor de él, con un margen de seguridad no inferior a 2 cm y abarcando la totalidad del espesor de la pared vesical", instrumental: ["Mango de bisturí 4"] },
                        { paso: 9, tecnica: "Se cierra la vejiga en dos planos; mucosa y la capa sero-muscular", instrumental: ["ác. poliglicólico (DEXON) de 4/0, 5/0 y 3/0"] },
                        { paso: 10, tecnica: "Se coloca una sonda uretral de 20 F y un drenaje perivesical.", instrumental: ["Sonda Ureteral"] }
                    ]
                }
            }
        },
        {
            id: 26,
            titulo: "Cistostomía",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Este procedimiento consiste en colocar un catéter en la vejiga, a través de la pared del abdomen, para drenar la orina directamente hacia el exterior y así evitar el daño renal.",
                    anatomia: {
                        titulo: "ANATOMÍA",
                        secciones: [
                            {
                                titulo: "Descripción general",
                                contenido: `La vejiga es un órgano muscular hueco y distensible, situado en la cavidad pelviana, por detrás de la sínfisis del pubis. En los hombres, se encuentra por delante del recto y en la mujer es anterior a la vagina e inferior al útero. Con una capacidad de la vejiga oscila en promedio entre 700 y 800 Ml.`,
                                imagen: "./assets/planeamientos/cistostomia/images/image8.png"
                            },
                            {
                                titulo: "La vejiga posee 3 porciones",
                                contenido: `* Cuerpo: Dónde la orina es recolectada.
* Fondo (Base): Contiene al trígono vesical.
* Trígono Vesical: Donde se localiza la uretra.
A su vez se compone por 3 capas:

* Capa Serosa: Se compone de tejido conectivo alveolar.
* Capa Muscular: Formada por 3 capas de fibras musculares lisas: Longitudinal interna, circular media, longitudinal externa.
* Capa Mucosa: Compuesta por epitelio de transición y una lámina propia subyacente.`,
                                imagen: "./assets/planeamientos/cistostomia/images/image5.png"
                            },
                            {
                                titulo: "Relaciones de la vejiga",
                                contenido: `* PARTE ANTERIOR:
* Sínfisis del pubis
* Espacio prevesical de Retzius.
* Músculos de la pared abdominal
* Fascia umbilicoprevesical
* Uraco
* Vasos umbilicales obliterados

* PARTE INFERIOR:
* Músculo elevador del ano
* Músculos internos de la pelvis

* PARTE POSTERIOR:
* Tiene el fondo de saco vésico rectal de Douglas y la Ampolla rectal.

* PARTE SUPERIOR:
* Uréteres, Conductos Deferentes y Vesículas Seminales.`
                            }
                        ]
                    },
                    irrigacion: {
                        titulo: "IRRIGACIÓN E INERVACIÓN",
                        contenido: `Es drenada por las venas ilíacas internas, y tanto en hombres como en mujeres, los vasos linfáticos de las caras supero laterales de la vejiga desembocan en los ganglios linfáticos ilíacos externos\n\nINERVACION\n      Involucra el sistema nervioso simpático y parasimpático\n\n1. Las fibras simpáticas presinápticas para la vejiga urinaria son conducidas desde los niveles torácicos inferiores y lumbares superiores de la médula espinal a través de los nervios esplácnicos lumbares pasando por el tronco simpático lumbar, plexo hipogástrico superior y nervios hipogástricos hacia los plexos vesicales (pélvicos). Es un subplexo del plexo hipogástrico inferior, de ahí envían fibras autónomas postsinápticas a las paredes de la vejiga urinaria.\n2. Las fibras parasimpáticas presinápticas para la vejiga urinaria se originan en las neuronas de los segmentos sacros de la médula espinal S2-S4 y pasan desde los  ramos  anteriores de los nervios espinales  sacros ,a  través de los  nervios esplénicos pélvicos  y los  plexos hipogástricos inferiores, hasta la  vejiga urinaria.`,
                        imagenes: [
                            "./assets/planeamientos/cistostomia/images/image3.png",
                            "./assets/planeamientos/cistostomia/images/image7.png"
                        ]
                    },
                    fisiologia: {
                        titulo: "FISIOLOGÍA",
                        contenido: `Los músculos de la vejiga que permiten el control voluntario de la micción y permiten 2 funciones: 1) la sensación que permite que reconozcas que tu vejiga está llena y debe ser vaciada y 2) el control motor que permite que puedas orinar voluntariamente.
Primero, como la pared vesical se estira cuando está llena o próxima a su máxima capacidad, existen señales que son transmitidas a través del sistema nervioso parasimpático para contraer el músculo detrusor, el cual es una capa de la pared vesical constituida por fibras de músculo liso que son ordenadas en fascículos longitudinales, circulares o en espiral, esta señal estimulará a la vejiga para expulsar orina a través de la uretra, luego, estas sensaciones dentro de la vejiga serán transmitidas al sistema nervioso central (SNC) por medio de fibras aferentes viscerales generales (AVG). Mientras las fibras aferentes en la cara superior de la vejiga siguen el curso de los nervios simpáticos eferentes hasta el SNC, las fibras aferentes en la porción inferior siguen a las fibras parasimpáticas eferentes.`,
                        funciones: [],
                        imagenes: ["./assets/planeamientos/cistostomia/images/image6.png"]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta de Plastia", "Sonda acanalada"],
                            equipos: [
                                "Paquete de ropa",
                                "Hoja #11",
                                "Catéter de 30 cm calibre 14",
                                "Jeringa 50 ml",
                                "Sonda foley 18Fr",
                                "Guantes",
                                "Gasas",
                                "Electrobisturí",
                                "Cistofló",
                                "Jeringa 10 ml",
                                "Caucho de succión",
                                "Micropore"
                            ],
                            suturas: [
                                "Piel: Polipropileno 3/0 con aguja 3/8 de círculo cortante con aguja de 27 mm"
                            ],
                            farmacos: ["Solución salina", "Lidocaína 1%", "Agua estéril (balón de sonda foley)"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo y Reserva", items: [], imagen: "./assets/planeamientos/cistostomia/images/image11.png", large: true },
                    mesaReserva: { titulo: "", items: [], imagen: "", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito Supino + Rodillo de sábana bajo la cadera", descripcion: "Decúbito Supino + Rodillo de sábana bajo la cadera", imagen: "./assets/planeamientos/cistostomia/images/image10.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/cistostomia/images/image4.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general",
                    anestesiaImagen: "./assets/planeamientos/cistostomia/images/image1.png",
                    incision: { nombre: "Incisión supra púbica infra abdominal transversal", tipo: "Abordaje suprapúbico", descripcion: "Se realiza una incisión supra púbica infra abdominal transversal de 2-3 cm" },
                    pasos: [
                        { paso: 1, tecnica: "Se hace una incisión de 2-3 cm en la región suprapúbica de manera transversal", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #11"] },
                        { paso: 2, tecnica: "Se introduce el catéter a través de la incisión, con una inclinación caudal de 60°", instrumental: ["Catéter calibre 14", "Jeringa de 50cc"] },
                        { paso: 3, tecnica: "Se atraviesa la aponeurosis y penetra en la vejiga distendida, se aspira orina para comprobar que la punta de catéter haya penetrado la vejiga", instrumental: ["Jeringa 50ml"] },
                        { paso: 4, tecnica: "Se divulsionan las capas del tejido hasta llegar a la pared de la vejiga, se coloca la sonda acanalada sobre la sonda Foley para permitir el paso de esta", instrumental: ["Sonda Acanalada", "Sonda Foley"] },
                        { paso: 5, tecnica: "Estando colocada la sonda Foley se infla el balón de esta con agua estéril", instrumental: ["Sonda Foley", "Agua Estéril", "Jeringa 10ml"] },
                        { paso: 6, tecnica: "Se fija la sonda a la piel para asegurar su posición, se sutura alrededor a la incisión para proteger la entrada y evitar el riesgo de infección", instrumental: ["Polipropileno 3/0", "Porta agujas", "Pinza de disección"] },
                        { paso: 7, tecnica: "Se conecta la sonda Foley con el cistofló, se verifica retorno, se clampea bolsa de drenaje urinario", instrumental: ["Cistofló", "Clamp"] },
                        { paso: 8, tecnica: "Se hace limpieza del sitio operatorio y curación", instrumental: ["Gasas", "Micropore"] }
                    ]
                }
            }
        }
    ],


    "Testículo": [
        { id: 6, titulo: "Orquiectomía parcial", tipo: "simple", resumen: "Manejo de tejido y preservación testicular cuando aplica." },
        {
            id: 12,
            titulo: "Vasectomía",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Lograr la esterilización masculina permanente mediante la interrupción y oclusión de los conductos deferentes, impidiendo el paso de espermatozoides hacia el semen eyaculado.",
                    anatomia: {
                        titulo: "Anatomía del testículo",
                        contenido: `Los testículos son glándulas reproductoras masculinas localizadas en el escroto. Poseen forma ovoidea, con 4 a 6 cm de longitud y un peso aproximado de 10 a 15 gramos.

El escroto es usualmente asimétrico, con un testículo más inferior que el otro. Los testículos están suspendidos dentro del escroto por el cordón espermático.

CONDUCTOS ESPERMÁTICOS:
1. Conductillos eferentes: expulsan a los espermatozoides al conducto del epidídimo.
2. Conducto del epidídimo: permite la maduración y el almacenamiento de espermatozoides.
3. Conducto deferente: transporta los espermatozoides desde el epidídimo hacia los conductos eyaculadores.`,
                        imagenes: ["./assets/planeamientos/vasectomia/images/image1.png"]
                    },
                    partes: {
                        titulo: "Capas del testículo",
                        items: [
                            { nombre: "Piel o escroto", descripcion: "Capa externa que recubre y protege el testículo." },
                            { nombre: "Dartos", descripcion: "Capa de músculo liso superficial con función termorreguladora." },
                            { nombre: "Capa celular subcutánea", descripcion: "Tejido subcutáneo laxo que contribuye al soporte." },
                            { nombre: "Fascia espermática externa", descripcion: "Revestimiento derivado de la aponeurosis del oblicuo externo." },
                            { nombre: "Músculo cremáster", descripcion: "Eleva el testículo y ayuda en la termorregulación." },
                            { nombre: "Fascia espermática interna", descripcion: "Capa derivada de la fascia transversalis." },
                            { nombre: "Túnica vaginal del testículo", descripcion: "Saco seroso que rodea parcialmente al testículo." }
                        ],
                        imagenes: ["./assets/planeamientos/vasectomia/images/image10.jpg"]
                    },
                    irrigacion: {
                        titulo: "Irrigación y drenaje venoso",
                        contenido: `La irrigación testicular procede de la arteria testicular.

También participa la arteria cremastérica, rama de la arteria epigástrica inferior, y la arteria del conducto deferente, rama de la arteria vesical inferior.

El drenaje venoso se realiza por el plexo pampiniforme y la vena testicular.`,
                        imagenes: ["./assets/planeamientos/vasectomia/images/image9.png"]
                    },
                    fisiologia: {
                        titulo: "Fisiología testicular",
                        funciones: [
                            { nombre: "Producción de espermatozoides", descripcion: "Los testículos producen y almacenan las células germinales masculinas." },
                            { nombre: "Producción hormonal", descripcion: "Secretan andrógenos, principalmente testosterona." }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta de plastia"],
                            equipos: ["Paquete de ropa", "Gasas", "Compresas", "Torundas", "Jeringa 10CC", "Aguja hipodérmica 18 y 26", "Hoja de bisturí #15", "Electrobisturí", "Guantes"],
                            suturas: ["Piel: Polipropileno 2/0 o 3/0 con aguja 3/8 de círculo cortante de 27 mm.", "TCS: Poliglactina 910 2/0 con aguja 1/2 círculo redonda de 27 mm.", "Fascia y músculo: Poliglactina 910 1 o 0 con aguja 1/2 círculo redonda de 37 mm.", "Conductos deferentes: Seda 3/0 con aguja 1/2 círculo redonda.", "Escroto: Catgut cromado 3/0 o 4/0 con aguja 1/2 círculo redonda."],
                            farmacos: ["Solución salina", "Lidocaína al 1% sin epinefrina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/vasectomia/images/image2.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/vasectomia/images/image6.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Posición del paciente en decúbito supino para el abordaje escrotal.", imagen: "./assets/planeamientos/vasectomia/images/image4.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/vasectomia/images/image7.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia regional o local",
                    incision: { nombre: "Incisión escrotal", tipo: "Abordaje escrotal", descripcion: "Incisión sobre el escroto para exponer el conducto deferente.", imagen: "./assets/planeamientos/vasectomia/images/image8.png" },
                    pasos: [
                        { paso: 1, tecnica: "Incisión del escroto", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                        { paso: 2, tecnica: "Visualización del conducto deferente", instrumental: ["Pinza baby mosquito curva"] },
                        { paso: 3, tecnica: "Toma del conducto deferente", instrumental: ["Pinza de anillo"] },
                        { paso: 4, tecnica: "Selección de una pequeña porción del conducto y cauterización", instrumental: ["Tijeras de plastia", "Electrobisturí"] },
                        { paso: 5, tecnica: "Puntos de transfixión en los extremos", instrumental: ["Porta agujas de plastia", "Seda 3/0 con aguja 1/2 círculo redonda"] },
                        { paso: 6, tecnica: "Se repite el procedimiento en el lado opuesto", instrumental: [] },
                        { paso: 7, tecnica: "Cierre del escroto y curación", instrumental: ["Catgut cromado 3/0 o 4/0 aguja curva redonda 1/2 círculo"] }
                    ]
                }
            }
        },
        {
            id: 15,
            titulo: "Varicocelectomía",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Corregir la dilatación anormal de las venas del plexo pampiniforme del cordón espermático, mediante la ligadura o interrupción del flujo venoso afectado, con el fin de mejorar el drenaje sanguíneo testicular, disminuir el dolor o malestar escrotal, prevenir el deterioro de la función testicular y favorecer la fertilidad masculina cuando esta se encuentra comprometida.",
                    anatomia: {
                        titulo: "Anatomía y fisiología del testículo",
                        secciones: [
                            {
                                titulo: "Anatomía",
                                contenido: `Los testículos son glándulas reproductoras masculinas localizadas en el escroto. Poseen forma ovoidea, con 4 a 6 cm de longitud y con un peso de 10-15 gramos.

El escroto es usualmente asimétrico, con un testículo más inferior que el otro, usualmente el izquierdo. Los testículos están suspendidos dentro del escroto por el cordón espermático.

Conductos espermáticos:
1. Conductillos eferentes: expulsan a los espermatozoides al conducto epidídimo.
2. Conducto del epidídimo: maduración y almacenamiento de espermatozoides.
3. Conducto deferente: transporte de los espermatozoides desde el epidídimo hacia los conductos eyaculadores.`,
                                imagenes: ["./assets/planeamientos/varicocelectomia/images/image1.png"]
                            },
                            {
                                titulo: "Capas del testículo",
                                contenido: `El testículo está recubierto por siete capas principales que le brindan protección y soporte. Estas capas se organizan desde la más superficial hasta la más profunda e incluyen el escroto, dartos, capa celular subcutánea, fascia espermática externa, músculo cremáster, fascia espermática interna y túnica vaginal del testículo.`,
                                imagen: "./assets/planeamientos/varicocelectomia/images/image12.jpg",
                                large: true
                            }
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación y drenaje venoso",
                        contenido: `La irrigación testicular procede de la arteria testicular.

También participa la arteria cremastérica, rama de la arteria epigástrica inferior, y la arteria del conducto deferente, rama de la arteria vesical inferior.

El drenaje venoso se realiza por el plexo pampiniforme y la vena testicular.`,
                        imagenes: ["./assets/planeamientos/varicocelectomia/images/image11.png"]
                    },
                    fisiologia: {
                        titulo: "Fisiología testicular",
                        funciones: [
                            { nombre: "Producción de espermatozoides", descripcion: "Los testículos producen y almacenan las células germinales masculinas." },
                            { nombre: "Producción hormonal", descripcion: "Secretan andrógenos, principalmente testosterona." }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta de plastia"],
                            equipos: ["Paquete de ropa", "Gasas", "Compresas", "Apósitos", "Asepto jeringa", "Caucho de succión", "Hoja de bisturí #15", "Guantes", "Electrobisturí", "Cánula de Yankauer", "Dren de Penrose", "Sonda Nelaton 6"],
                            suturas: ["Piel: Polipropileno 2/0 o 3/0 con aguja 3/8 de círculo cortante de 27 mm.", "TCS: Poliglactina 910 2/0 con aguja 1/2 círculo redonda de 27 mm.", "Fascia y músculo: Poliglactina 910 1 o 0 con aguja 1/2 círculo redonda de 37 mm.", "Reparos: Seda precortada 2/0"],
                            farmacos: ["Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/varicocelectomia/images/image3.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/varicocelectomia/images/image5.png", large: true },
                    posicionPaciente: {
                        titulo: "Posiciones del paciente",
                        nombre: "Decúbito supino y decúbito supino Trendelenburg",
                        descripcion: "Se utilizan dos posiciones para el abordaje: decúbito supino y decúbito supino Trendelenburg, según la necesidad de exposición quirúrgica.",
                        posiciones: [
                            { nombre: "Decúbito supino", imagen: "./assets/planeamientos/varicocelectomia/images/image6.png" },
                            { nombre: "Decúbito supino Trendelenburg", imagen: "./assets/planeamientos/varicocelectomia/images/image10.png" }
                        ],
                        large: true
                    },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/varicocelectomia/images/image8.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia regional o anestesia general",
                    incision: { nombre: "Incisión inguinal", tipo: "Abordaje inguinal", descripcion: "Incisión inguinal para la exposición del cordón espermático y la disección de las venas espermáticas.", imagen: "./assets/planeamientos/varicocelectomia/images/image9.png" },
                    pasos: [
                        { paso: 1, tecnica: "Incisión inguinal de la piel y tejido celular subcutáneo", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                        { paso: 2, tecnica: "Hemostasia", instrumental: ["Pinza mosquito curva", "Lapicero del electrobisturí"] },
                        { paso: 3, tecnica: "Visualización de la fascia e incisión", instrumental: ["Separador de Farabeuf", "Tijeras de Metzenbaum"] },
                        { paso: 4, tecnica: "Divulsión del músculo oblicuo menor", instrumental: ["Pinza Kelly curva"] },
                        { paso: 5, tecnica: "Visualización del cordón espermático", instrumental: [] },
                        { paso: 6, tecnica: "Disección de las venas espermáticas", instrumental: ["Pinza mosquito curva"] },
                        { paso: 7, tecnica: "Clampeo de las venas a cada lado y ligadura", instrumental: ["Pinza Kelly curva", "Tijeras de plastia", "Seda 2/0 precortada"] },
                        { paso: 8, tecnica: "Hemostasia y cierre por planos con curación", instrumental: ["Pinza Kelly curva", "Lapicero del electrobisturí", "Portaagujas pequeño", "Disección Adson con garra", "Poliglactina 910 1 aguja curva redonda medio círculo", "Polipropileno 3/0 con aguja 1/2 círculo redonda"] }
                    ]
                }
            }
        },
        {
    id: 16,
    titulo: "Torsión Testicular",
    tipo: "planeamiento-complejo",
    etapas: {
        planeacion: {
            objetivo: "Restaurar el flujo sanguíneo al testículo afectado lo antes posible para preservar la viabilidad del tejido y evitar necrosis testicular, mediante la reducción de la torsión del cordón espermático.",
            anatomia: {
                titulo: "Anatomía del testículo",
                contenido: `Los testículos son glándulas reproductoras masculinas localizadas en el escroto. Poseen forma ovoidea, con 4 a 6 cm de longitud y con un peso de 10-15 gramos. El escroto es usualmente asimétrico, con un testículo más inferior que el otro. Los testículos están suspendidos dentro del escroto por el cordón espermático.`,
                imagenes: ["./assets/planeamientos/torsion-testicular/images/image14.png"]
            },
            partes: {
                titulo: "Capas del testículo",
                items: [
                    { nombre: "Piel o escroto", descripcion: "Capa externa protectora." },
                    { nombre: "Dartos", descripcion: "Capa de músculo liso." },
                    { nombre: "Capa celular subcutánea", descripcion: "Tejido laxo." },
                    { nombre: "Fascia espermática externa", descripcion: "Derivada del oblicuo externo." },
                    { nombre: "Músculo cremáster", descripcion: "Encargado de la elevación testicular." },
                    { nombre: "Fascia espermática interna", descripcion: "Capa profunda." },
                    { nombre: "Túnica vaginal del testículo", descripcion: "Saco seroso que envuelve el testículo." }
                ],
                imagenes: ["./assets/planeamientos/torsion-testicular/images/image1.jpg"]
            },
            irrigacion: {
                titulo: "Irrigación y drenaje venoso",
                contenido: `La irrigación procede de la arteria testicular, la arteria cremastérica y la arteria del conducto deferente. El drenaje venoso se realiza a través del plexo pampiniforme y la vena testicular.`,
                imagenes: ["./assets/planeamientos/torsion-testicular/images/image17.png"]
            },
            fisiologia: {
                titulo: "Fisiología testicular",
                funciones: [
                    { nombre: "Espermatogénesis", descripcion: "Producción y almacenamiento de espermatozoides." },
                    { nombre: "Función endocrina", descripcion: "Secreción de andrógenos, principalmente testosterona." }
                ]
            },
            checklist: {
                titulo: "Lista de chequeo",
                categorias: {
                    instrumental: ["Canasta de Plastia"],
                    equipos: ["Paquete de ropa general", "Gasa", "Compresas", "Torundas", "Apósitos", "Hoja de bisturí #15", "Aseptojeringa", "Caucho de succión", "Guantes", "Electrobisturí", "Vessel loops"],
                    suturas: ["TCS: Poliglactina 910 2/0 (aguja 1/2 círculo redonda 27 mm)", "FASCIA Y MÚSCULO: Poliglactina 910 1 o 0 (aguja 1/2 círculo redonda 37 mm)", "FIJACIÓN AL ESCROTO: Polipropileno 4/0, 5/0 o 6/0 (aguja 1/2 círculo redonda)", "ESCROTO: Catgut cromado 3/0 o 4/0 (aguja 1/2 círculo redonda)"],
                    farmacos: ["Solución Salina"]
                }
            }
        },
        organizacion: {
            mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/torsion-testicular/images/image9.png", large: true },
            mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/torsion-testicular/images/image7.png", large: true },
            posicionPaciente: { 
                titulo: "Posición del paciente", 
                nombre: "Decúbito supino", 
                descripcion: "El paciente se coloca boca arriba para permitir un abordaje escrotal directo.", 
                imagen: "./assets/planeamientos/torsion-testicular/images/image4.png", 
                large: true 
            },
            equipoQuirurgico: { 
                titulo: "Ubicación del equipo quirúrgico", 
                roles: [], 
                imagen: "./assets/planeamientos/torsion-testicular/images/image2.png", 
                large: true 
            }
        },
        ejecucion: {
            anestesia: "Anestesia General o Raquídea",
            // Nota: Se incluyen las dos imágenes solicitadas para anestesia
            anestesiaImagen: "./assets/planeamientos/torsion-testicular/images/image12.png", 
            incision: { 
                nombre: "Incisión escrotal anterior", 
                tipo: "Siguiendo el pliegue", 
                descripcion: "Abordaje directo sobre el escroto para acceder a la túnica vaginal y el cordón.", 
                imagen: "./assets/planeamientos/torsion-testicular/images/image15.png" 
            },
            pasos: [
                { paso: 1, tecnica: "Incisión escrotal anterior siguiendo el pliegue", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                { paso: 2, tecnica: "Toma de la túnica vaginal e incisión", instrumental: ["Pinza Mosquito curva", "Tijeras de Plastia"] },
                { paso: 3, tecnica: "Se libera el testículo del escroto y reducción de la torsión testicular", instrumental: ["Gasas húmedas tibias"] },
                { paso: 4, tecnica: "Se observa el color para evaluar viabilidad (si es oscuro se procede a resección)", instrumental: ["Tijeras de Metzembaum"] },
                { paso: 5, tecnica: "Se fija el cordón espermático al escroto", instrumental: ["Porta agujas fino", "Pinza de disección adson sin garra", "Polipropileno 4/0, 5/0 o 6/0"] },
                { paso: 6, tecnica: "Se hace cierre de las capas del escroto y se realiza curación", instrumental: ["Portaagujas fino", "Pinza de disección adson sin garra", "Catgut cromado 3/0 o 4/0"] }
            ]
        }
    }
},
{
    id: 17,
    titulo: "Orquidopexia",
    tipo: "planeamiento-complejo",
    etapas: {
        planeacion: {
            objetivo: "Descender y fijar el testículo dentro del escroto cuando este no ha descendido adecuadamente o presenta riesgo de torsión, con el fin de preservar la función testicular, la fertilidad y facilitar la detección temprana de alteraciones.",
            anatomia: {
                titulo: "Anatomía del testículo",
                contenido: "Los testículos son glándulas reproductoras masculinas localizadas en el escroto. Poseen forma ovoidea, con 4 a 6 cm de longitud y un peso de 10-15 gramos. Están suspendidos dentro del escroto por el cordón espermático.",
                imagenes: ["./assets/planeamientos/orquidopexia/images/image3.png"]
            },
            partes: {
                titulo: "Capas del testículo",
                items: [
                    { nombre: "Piel o escroto", descripcion: "Capa externa protectora." },
                    { nombre: "Dartos", descripcion: "Músculo liso termorregulador." },
                    { nombre: "Capa celular subcutánea", descripcion: "Tejido laxo de soporte." },
                    { nombre: "Fascia espermática externa", descripcion: "Derivada de la aponeurosis del oblicuo externo." },
                    { nombre: "Músculo cremáster", descripcion: "Fibras musculares que elevan el testículo." },
                    { nombre: "Fascia espermática interna", descripcion: "Derivada de la fascia transversalis." },
                    { nombre: "Túnica vaginal", descripcion: "Saco seroso que rodea el testículo." }
                ],
                imagenes: ["./assets/planeamientos/orquidopexia/images/image1.jpg"]
            },
            irrigacion: {
                titulo: "Irrigación y drenaje venoso",
                contenido: "La irrigación testicular procede de la arteria testicular, la arteria cremastérica y la arteria del conducto deferente. El drenaje venoso principal se realiza por el plexo pampiniforme.",
                imagenes: ["./assets/planeamientos/orquidopexia/images/image11.png"]
            },
            fisiologia: {
                titulo: "Fisiología testicular",
                funciones: [
                    { nombre: "Espermatogénesis", descripcion: "Producción de células germinales masculinas." },
                    { nombre: "Producción hormonal", descripcion: "Secreción de testosterona y otros andrógenos." }
                ]
            },
            checklist: {
                titulo: "Lista de chequeo",
                categorias: {
                    instrumental: ["Canasta de plastia"],
                    equipos: ["Paquete de ropa", "Gasas", "Compresas", "Torundas", "Jeringa 10CC", "Aguja hipodérmica 18 y 26", "Hoja de bisturí #15", "Electrobisturí", "Guantes"],
                    suturas: [
                        "Piel: Polipropileno 2/0 o 3/0",
                        "TCS: Poliglactina 910 2/0",
                        "Fascia y músculo: Poliglactina 910 1 o 0",
                        "Fijación: Polipropileno 4/0, 5/0 o 6/0 (aguja 3/8 círculo cortante)"
                    ],
                    farmacos: ["Solución salina"]
                }
            }
        },
        organizacion: {
            mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/orquidopexia/images/image5.png", large: true },
            mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/orquidopexia/images/image4.png", large: true },
            posicionPaciente: { 
                titulo: "Posición del paciente", 
                nombre: "Decúbito supino", 
                descripcion: "Posición estándar para el abordaje inguinal y escrotal.", 
                imagen: "./assets/planeamientos/orquidopexia/images/image6.png", 
                large: true 
            },
            equipoQuirurgico: { 
                titulo: "Ubicación del equipo quirúrgico", 
                roles: [], 
                imagen: "./assets/planeamientos/orquidopexia/images/image9.png", 
                large: true 
            }
        },
        ejecucion: {
            anestesia: "Anestesia general o raquídea",
            anestesiaImagen: "./assets/planeamientos/orquidopexia/images/image2.png",
            incision: { 
                nombre: "Incisión inguinal y escrotal", 
                tipo: "Abordaje inguinal", 
                descripcion: "Incisión en el pliegue inguinal para localización del cordón y segunda incisión escrotal para la fijación.", 
            },
            pasos: [
                { paso: 1, tecnica: "Incisión inguinal de 3-4cm y apertura de TCS", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                { paso: 2, tecnica: "Hemostasia", instrumental: ["Pinza mosquito curva", "Electrobisturí"] },
                { paso: 3, tecnica: "Visualización de la fascia y apertura", instrumental: ["Tijeras de Metzenbaum", "Separadores de Farabeuf"] },
                { paso: 4, tecnica: "Divulsión del músculo y localización del cordón", instrumental: ["Pinza Kelly", "Disección digital"] },
                { paso: 5, tecnica: "Disección del cordón hasta el escroto", instrumental: ["Tijeras de plastia", "Pinza mosquito recta", "Torundas"] },
                { paso: 6, tecnica: "Incisión en la piel del escroto", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                { paso: 7, tecnica: "Descenso y fijación del testículo al escroto", instrumental: ["Pinza mosquito curva", "Porta agujas fino", "Polipropileno 4/0, 5/0 o 6/0"] },
                { paso: 8, tecnica: "Cierre por planos y curación", instrumental: ["Porta agujas", "Poliglactina 910", "Sutura de piel"] }
            ]
        }
    }
},
{
    id: 18,
    titulo: "Orquiectomía",
    tipo: "planeamiento-complejo",
    etapas: {
        planeacion: {
            objetivo: "El objetivo de la orquiectomía es remover uno o ambos testículos para tratar diversas condiciones médicas, como cáncer, inflamación crónica, torsión testicular, criptorquidia o para reducir la producción de hormonas masculinas. Esta intervención busca aliviar síntomas, prevenir complicaciones y mejorar la calidad de vida del paciente. La orquiectomía puede ser realizada con fines terapéuticos, profilácticos o diagnósticos.",
            anatomia: {
                titulo: "Anatomía del testículo",
                contenido: `Los testículos son glándulas reproductoras masculinas localizadas en el escroto. Poseen forma ovoidea, con 4 a 6 cm de longitud y un peso aproximado de 10 a 15 gramos.

El escroto es usualmente asimétrico, con un testículo más inferior que el otro, usualmente el izquierdo. Los testículos están suspendidos dentro del escroto por el cordón espermático.

Conductos espermáticos:
1. Conductillos eferentes: expulsan a los espermatozoides al conducto epidídimo.
2. Conducto del epidídimo: maduración y almacenamiento de espermatozoides.
3. Conducto deferente: involucrado en el transporte de los espermatozoides desde el epidídimo hacia los conductos eyaculadores.`,
                imagenes: ["./assets/planeamientos/orquidectomia/images/image1.png"]
            },
            partes: {
                titulo: "Capas del testículo",
                items: [
                    { nombre: "Piel o escroto", descripcion: "Capa externa protectora del contenido testicular." },
                    { nombre: "Dartos", descripcion: "Capa muscular superficial con función de termorregulación." },
                    { nombre: "Capa celular subcutánea", descripcion: "Tejido de soporte y deslizamiento." },
                    { nombre: "Fascia espermática externa", descripcion: "Revestimiento derivado de planos aponeuróticos." },
                    { nombre: "Músculo cremáster", descripcion: "Participa en la elevación y protección del testículo." },
                    { nombre: "Fascia espermática interna", descripcion: "Envoltura profunda del cordón y testículo." },
                    { nombre: "Túnica vaginal del testículo", descripcion: "Capa serosa que recubre y facilita el movimiento." }
                ],
                imagenes: ["./assets/planeamientos/orquidectomia/images/image16.jpg"]
            },
            irrigacion: {
                titulo: "Irrigación y drenaje venoso",
                contenido: `La irrigación testicular procede de la arteria testicular.

También participa la arteria cremastérica, rama de la arteria epigástrica inferior, y la arteria del conducto deferente, rama de la arteria vesical inferior.

El drenaje venoso se realiza por el plexo pampiniforme y la vena testicular.

La inervación está dada por el plexo testicular.`,
                imagenes: ["./assets/planeamientos/orquidectomia/images/image9.png"]
            },
            fisiologia: {
                titulo: "Fisiología testicular",
                funciones: [
                    { nombre: "Producción espermática", descripcion: "Los testículos producen y almacenan las células germinales masculinas (espermatozoides)." },
                    { nombre: "Función endocrina", descripcion: "Secretan hormonas sexuales masculinas llamadas andrógenos, principalmente testosterona." }
                ]
            },
            checklist: {
                titulo: "Lista de chequeo",
                categorias: {
                    instrumental: ["Canasta de plastia", "Canasta infantil"],
                    equipos: ["Paquete de ropa general", "Compresas", "Gasas", "Torundas", "Apósito", "Asepto jeringa", "Hoja de bisturí #15", "Guantes", "Electrobisturí", "Dren de Penrose"],
                    suturas: ["Fascia y músculo: Poliglactina 910 2/0 o 3/0 con aguja 1/2 círculo redonda de 37 mm.", "Escroto: Catgut cromado 3/0 o 4/0 con aguja 1/2 círculo redonda.", "Ligadura del paquete vascular: Seda precortada 3/0.", "Conducto deferente: Seda 1 o 2/0 precortada."],
                    farmacos: ["Solución salina"]
                }
            }
        },
        organizacion: {
            mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/orquidectomia/images/image6.png", large: true },
            mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/orquidectomia/images/image8.png", large: true },
            posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "El paciente se ubica en decúbito supino para facilitar el abordaje inguinal y la exposición del cordón espermático.", imagen: "./assets/planeamientos/orquidectomia/images/image12.png", large: true },
            equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/orquidectomia/images/image2.png", large: true }
        },
        ejecucion: {
            anestesia: "Anestesia regional o general",
            anestesiaImagen: "./assets/planeamientos/orquidectomia/images/image13.png",
            incision: { nombre: "Incisión inguinal", tipo: "Abordaje inguinal", descripcion: "Abordaje medio o transverso con exposición del cordón espermático para resección testicular según indicación.", imagen: "./assets/planeamientos/orquidectomia/images/image11.png" },
            pasos: [
                { paso: 1, tecnica: "Incisión inguinal de piel y tejido celular subcutáneo", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                { paso: 2, tecnica: "Hemostasia inicial", instrumental: ["Pinza mosquito curva", "Lapicero del electrobisturí"] },
                { paso: 3, tecnica: "Reparo de cada lado de la incisión", instrumental: ["Pinza Kelly curva"] },
                { paso: 4, tecnica: "Ampliación de la incisión y reparo del plano", instrumental: ["Tijeras de Metzenbaum", "Pinza Kelly curva"] },
                { paso: 5, tecnica: "Toma del cordón espermático y sección", instrumental: ["Pinza Kelly curva", "Tijeras de plastia", "Torundas"] },
                { paso: 6, tecnica: "Ligadura del paquete vascular y extracción del testículo", instrumental: ["Seda precortada 3/0", "Frasco de patología"] },
                { paso: 7, tecnica: "Apertura y reparo de la cápsula testicular (técnica de conservación cuando aplica)", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                { paso: 8, tecnica: "Limpieza del contenido testicular", instrumental: ["Gasas", "Solución salina"] },
                { paso: 9, tecnica: "Hemostasia complementaria", instrumental: ["Lapicero de electrobisturí"] },
                { paso: 10, tecnica: "Cierre de la cápsula", instrumental: ["Porta agujas fino", "Catgut cromado 3/0 aguja curva redonda 1/2 círculo"] },
                { paso: 11, tecnica: "Cierre por planos del escroto y curación", instrumental: ["Portaagujas", "Poliglactina 910", "Catgut cromado", "Apósito"] }
            ]
        }
    }
},
{
    id: 19,
    titulo: "Hidrocelectomía",
    tipo: "planeamiento-complejo",
    etapas: {
        planeacion: {
            objetivo: "El objetivo quirúrgico de la hidrocelectomía es eliminar una hidrocele, que es una acumulación anormal de líquido en el saco escrotal que rodea al testículo. Este procedimiento se realiza para aliviar el dolor, la incomodidad y el agrandamiento del escroto, así como para prevenir posibles complicaciones. La intervención está indicada cuando la hidrocele es grande, causa molestias significativas o se relaciona con otras patologías. La recuperación suele ser rápida y los riesgos de complicaciones son bajos, aunque pueden incluir infección, hematomas o inflamación.",
            anatomia: {
                titulo: "Anatomía del testículo",
                contenido: `Los testículos son glándulas reproductoras masculinas localizadas en el escroto. Poseen forma ovoidea, con 4 a 6 cm de longitud y con un peso de 10-15 gramos.

El escroto es usualmente asimétrico, con un testículo más inferior que el otro (usualmente el izquierdo). Los testículos están suspendidos dentro del escroto por el cordón espermático.

Conductos espermáticos:
1. Conductillos eferentes: expulsan a los espermatozoides al conducto epidídimo.
2. Conducto del epidídimo: maduración y almacenamiento de espermatozoides.
3. Conducto deferente: involucrado en el transporte de los espermatozoides desde el epidídimo hacia los conductos eyaculadores.`,
                imagenes: ["./assets/planeamientos/hidrocelectomia/images/image2.png"]
            },
            partes: {
                titulo: "Capas del testículo",
                items: [
                    { nombre: "Piel o escroto", descripcion: "Capa externa protectora del contenido testicular." },
                    { nombre: "Dartos", descripcion: "Capa muscular superficial con función termorreguladora." },
                    { nombre: "Capa celular subcutánea", descripcion: "Tejido de soporte y deslizamiento." },
                    { nombre: "Fascia espermática externa", descripcion: "Revestimiento derivado de planos aponeuróticos." },
                    { nombre: "Músculo cremáster", descripcion: "Participa en la elevación y protección del testículo." },
                    { nombre: "Fascia espermática interna", descripcion: "Envoltura profunda del cordón y testículo." },
                    { nombre: "Túnica vaginal del testículo", descripcion: "Capa serosa que recubre y facilita el movimiento." }
                ],
                imagenes: ["./assets/planeamientos/hidrocelectomia/images/image1.jpg"]
            },
            irrigacion: {
                titulo: "Irrigación y drenaje venoso",
                contenido: `La irrigación testicular procede de la arteria testicular.

También participa la arteria cremastérica, rama de la arteria epigástrica inferior, y la arteria del conducto deferente, rama de la arteria vesical inferior.

El drenaje venoso se realiza por el plexo pampiniforme y la vena testicular.

La inervación está dada por el plexo testicular.`,
                imagenes: ["./assets/planeamientos/hidrocelectomia/images/image12.png"]
            },
            fisiologia: {
                titulo: "Fisiología testicular",
                funciones: [
                    { nombre: "Producción espermática", descripcion: "Los testículos producen y almacenan las células germinales masculinas (espermatozoides)." },
                    { nombre: "Función endocrina", descripcion: "Secretan hormonas sexuales masculinas llamadas andrógenos, principalmente testosterona." }
                ]
            },
            checklist: {
                titulo: "Lista de chequeo",
                categorias: {
                    instrumental: ["Canasta de plastia"],
                    equipos: ["Paquete de ropa", "Caucho de succión", "Frasco de patología", "Asepto jeringa", "Torundas", "Gasas", "Apósitos", "Compresas", "Hoja de bisturí #15", "Lapicero de electrobisturí", "Guantes", "Dren de Penrose", "Cánula de Yankauer"],
                    suturas: ["Piel: Polipropileno 2/0 o 3/0 con aguja 3/8 de círculo cortante de 27 mm.", "TCS: Poliglactina 910 2/0 con aguja 1/2 círculo redonda de 27 mm.", "Fascia y músculo: Poliglactina 910 1 o 0 con aguja 1/2 círculo redonda de 37 mm.", "Marzupialización: Poliglactina 910 4/0 con aguja 1/2 círculo redonda.", "Escroto: Catgut cromado 3/0 o 4/0 con aguja 1/2 círculo redonda."],
                    farmacos: ["Solución salina"]
                }
            }
        },
        organizacion: {
            mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/hidrocelectomia/images/image7.png", large: true },
            mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/hidrocelectomia/images/image3.png", large: true },
            posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Posición en decúbito supino para abordaje escrotal y exposición adecuada del saco hidrocelar.", imagen: "./assets/planeamientos/hidrocelectomia/images/image9.png", large: true },
            equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/hidrocelectomia/images/image8.png", large: true }
        },
        ejecucion: {
            anestesia: "Anestesia raquídea y general",
            anestesiaImagen: "./assets/planeamientos/hidrocelectomia/images/image6.png",
            incision: { nombre: "Incisión escrotal", tipo: "Abordaje escrotal", descripcion: "Incisión por vía escrotal sobre la túnica vaginal para drenaje, resección parcial del saco hidrocelar y manejo definitivo.", imagen: "./assets/planeamientos/hidrocelectomia/images/image4.png" },
            pasos: [
                { paso: 1, tecnica: "Incisión por vía escrotal sobre la túnica vaginal", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                { paso: 2, tecnica: "Disección por planos y apertura del saco hidrocelar", instrumental: ["Tijeras de plastia", "Pinza de disección"] },
                { paso: 3, tecnica: "Drenaje del líquido hidrocelar y resección parcial del saco", instrumental: ["Succión", "Tijeras de plastia"] },
                { paso: 4, tecnica: "Marzupialización o eversión del saco hidrocelar para evitar recidiva", instrumental: ["Porta agujas fino", "Poliglactina 910 4/0"] },
                { paso: 5, tecnica: "Clampaje y ligadura de vasos sangrantes", instrumental: ["Pinza Kelly"] },
                { paso: 6, tecnica: "Verificación de hemostasia final", instrumental: ["Electrobisturí", "Pinza mosquito curva"] },
                { paso: 7, tecnica: "Colocación de dren por contrabertura cuando se requiere", instrumental: ["Dren Penrose"] },
                { paso: 8, tecnica: "Cierre por planos del tejido y túnica", instrumental: ["Poliglactina 910 2/0 con aguja 1/2 círculo redonda"] },
                { paso: 9, tecnica: "Cierre del tejido escrotal y curación", instrumental: ["Catgut cromado 3/0 o 4/0", "Polipropileno 2/0 o 3/0", "Apósito"] }
            ]
        }
    }
},
{
    id: 20,
    titulo: "Epididectomía",
    tipo: "planeamiento-complejo",
    etapas: {
        planeacion: {
            objetivo: "Consiste en la extirpación parcial o total del epidídimo debido a la presencia de quistes para prevenir los abscesos. No es recomendable ya que causa infertilidad. Se hace sobre todo en quistes sebáceos ya que tienen mayor riesgo de formar fistulas. El procedimiento está indicado cuando el quiste epidídimo es grande, causa molestias significativas o se asocia a complicaciones. La recuperación suele ser rápida aunque pueden presentarse infección, hematomas o inflamación.",
            anatomia: {
                titulo: "Anatomía del testículo",
                contenido: `Los testículos son glándulas reproductoras masculinas localizadas en el escroto. Poseen forma ovoidea, con 4 a 6 cm de longitud y con un peso de 10-15 gramos.

El escroto es usualmente asimétrico, con un testículo más inferior que el otro (usualmente el izquierdo). Los testículos están suspendidos dentro del escroto por el cordón espermático.

Conductillos eferentes: expulsan a los espermatozoides al conducto epidídimo.
Conducto del epidídimo: maduración y almacenamiento de espermatozoides.
Conducto deferente: involucrado en el transporte de los espermatozoides desde el epidídimo hacia los conductos eyaculadores.`,
                imagenes: ["./assets/planeamientos/epididectomia/images/image1.png"]
            },
            partes: {
                titulo: "Capas del testículo",
                items: [
                    { nombre: "Piel o escroto", descripcion: "Capa externa protectora del contenido testicular." },
                    { nombre: "Dartos", descripcion: "Capa muscular superficial con función termorreguladora." },
                    { nombre: "Capa celular subcutánea", descripcion: "Tejido de soporte y deslizamiento." },
                    { nombre: "Fascia espermática externa", descripcion: "Revestimiento derivado de planos aponeuróticos." },
                    { nombre: "Músculo cremáster", descripcion: "Participa en la elevación y protección del testículo." },
                    { nombre: "Fascia espermática interna", descripcion: "Envoltura profunda del cordón y testículo." },
                    { nombre: "Túnica vaginal del testículo", descripcion: "Capa serosa que recubre y facilita el movimiento." }
                ],
                imagenes: ["./assets/planeamientos/epididectomia/images/image10.jpg"]
            },
            irrigacion: {
                titulo: "Irrigación y drenaje venoso",
                contenido: `La irrigación testicular procede de la arteria testicular.

También participa la arteria cremastérica, rama de la arteria epigástrica inferior, y la arteria del conducto deferente, rama de la arteria vesical inferior.

El drenaje venoso se realiza por el plexo pampiniforme y la vena testicular.

La inervación está dada por el plexo testicular.`,
                imagenes: ["./assets/planeamientos/epididectomia/images/image9.png"]
            },
            fisiologia: {
                titulo: "Fisiología testicular",
                funciones: [
                    { nombre: "Producción espermática", descripcion: "Los testículos producen y almacenan las células germinales masculinas (espermatozoides)." },
                    { nombre: "Función endocrina", descripcion: "Secretan hormonas sexuales masculinas llamadas andrógenos, principalmente testosterona." }
                ]
            },
            checklist: {
                titulo: "Lista de chequeo",
                categorias: {
                    instrumental: ["Canasta de plastia", "Mango de bisturí #3", "Hoja de bisturí #15", "Electrobisturí", "Frasco de patología", "Dren de Penrose (opcional)"],
                    equipos: ["Paquete de ropa", "Gasas", "Compresas", "Torundas", "Apósitos", "Asepto jeringa", "Guantes"],
                    suturas: ["TCS: Poliglactina 910 2/0 con aguja 1/2 círculo redonda de 27 mm.", "Fascia y músculo: Poliglactina 910 1 o 0 con aguja 1/2 círculo redonda de 37 mm.", "Ligadura de los lobulillos y conducto deferente: Seda precortada 3/0 y 4/0", "Escroto: Catgut cromado 3/0 o 4/0 con aguja 1/2 círculo redonda"],
                    farmacos: ["Solución salina", "Lidocaína al 1% sin epinefrina"]
                }
            }
        },
        organizacion: {
            mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/epididectomia/images/image2.png", large: true },
            mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/epididectomia/images/image6.png", large: true },
            posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Posición en decúbito supino para abordaje escrotal y exposición adecuada del epidídimo y estructuras asociadas.", imagen: "./assets/planeamientos/epididectomia/images/image4.png", large: true },
            equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/epididectomia/images/image7.png", large: true }
        },
        ejecucion: {
            anestesia: "Anestesia regional o general",
            incision: { nombre: "Incisión escrotal", tipo: "Abordaje escrotal", descripcion: "Incisión escrotal siguiendo el pliegue natural para acceso y disección del epidídimo.", imagen: "./assets/planeamientos/epididectomia/images/image8.png" },
            pasos: [
                { paso: 1, tecnica: "Incisión escrotal siguiendo el pliegue", instrumental: ["Mango de bisturí #3", "Hoja de bisturí #15"] },
                { paso: 2, tecnica: "Hemostasia", instrumental: ["Electrobisturí"] },
                { paso: 3, tecnica: "Incisión de la túnica vaginal", instrumental: ["Pinza mosquito curva", "Tijeras de plastia"] },
                { paso: 4, tecnica: "Disección y tracción de la cabeza del epidídimo", instrumental: ["Pinza Babcock", "Tijera de Metzenbaum", "Pinza de disección fina"] },
                { paso: 5, tecnica: "Sección y ligadura del conducto deferente", instrumental: ["Seda precortada 3/0"] },
                { paso: 6, tecnica: "Cierre de las capas del escroto y curación", instrumental: ["Catgut cromado 3/0 o 4/0 con aguja 1/2 círculo redonda"] },
                { paso: 7, tecnica: "Colocación de dren si el quiste era muy grande (opcional)", instrumental: ["Dren Penrose"] }
            ]
        }
    }
}
    ],


    "Pene": [
        {
            id: 7,
            titulo: "Priapismo",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Aliviar la erección persistente y dolorosa para prevenir el daño tisular permanente, la fibrosis de los cuerpos cavernosos y la disfunción eréctil.",
                    anatomia: {
                        titulo: "Anatomía y fisiología del pene",
                        contenido: `El pene es un órgano externo del aparato reproductor masculino compuesto por varias estructuras anatómicas. En su base se encuentra la raíz, que conecta el pene a la pelvis; el cuerpo es la parte media, compuesta por dos cuerpos cavernosos y un cuerpo esponjoso, los cuerpos cavernosos son tejidos cilíndricos que se llenan de sangre para provocar una erección que se extiende hasta el glande, o punta del pene, el glande es la cabeza expandida en el extremo distal del pene, con un orificio uretral externo en su punta. La parte externa mide 8 a 10 cm de largo y 3 cm de diámetro cuando está flácido (sin erección); las dimensiones típicas de un pene erecto son de 13 a 18 cm de largo y 4 cm de diámetro.`,
                        imagenes: [
                            "./assets/planeamientos/priapismo/images/image7.png",
                            "./assets/planeamientos/priapismo/images/image9.jpg"
                        ],
                        imagenDebajo: "./assets/planeamientos/priapismo/images/image8.jpg",
                        genitalesExternos: [
                            "Pene (compuesto por 2 cuerpos cavernosos y 1 cuerpo esponjoso, recubierto por el prepucio; glande en la punta)",
                            "Escroto (cubre los testículos)"
                        ],
                        genitalesInternos: [
                            "Testículos (forman los espermatozoides)",
                            "Epidídimo (almacena y madura espermatozoides)",
                            "Conducto deferente (transporta espermatozoides)",
                            "Vesículas seminales y próstata (aportan fluidos seminales)",
                            "Uretra (conduce orina y semen a través del pene)"
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación",
                        contenido: `El pene está irrigado por ramas de la arteria pudenda interna, rama de la arteria ilíaca interna. La sangre sale del pene por venas superficiales y profundas.`,
                        arterias: [
                            "Arteria peneana común",
                            "Arteria bulbo uretral",
                            "Arteria dorsal del pene",
                            "Arteria cavernosa",
                            "Arteria del bulbo del pene"
                        ],
                        venas: [
                            "Vena pudenda externa superficial",
                            "Vena dorsal profunda del pene"
                        ]
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `Los nervios pudendos y los nervios cavernosos son los principales responsables de la inervación del pene. Los nervios pudendos proveen sensibilidad y función motora perineal; los nervios cavernosos participan en la regulación neurovascular de la erección.`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `La erección es un proceso neurovascular que involucra relajación del músculo liso, dilatación arterial y compresión venosa. La eyaculación tiene fases de emisión y expulsión; la detumescencia ocurre por activación simpática y vasoconstricción.`,
                        funciones: [
                            { nombre: "Estimulación", descripcion: "Activación del sistema parasimpático (S2-S4) que inicia la respuesta eréctil." },
                            { nombre: "Liberación de óxido nítrico (NO)", descripcion: "Relajación del músculo liso de los cuerpos cavernosos y vasodilatación." },
                            { nombre: "Vasodilatación y llenado", descripcion: "Aumento del flujo sanguíneo hacia los cuerpos cavernosos, compresión venosa y turgencia." },
                            { nombre: "Detumescencia", descripcion: "Activación simpática post-eyaculación que produce vasoconstricción y retorno a la flacidez." }
                        ],
                        imagenes: []
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Equipo de plastia"],
                            equipos: [
                                "Paquete de ropa",
                                "Lapicero del electrocauterio",
                                "Hoja de Bisturí #15",
                                "Compresas",
                                "Guantes",
                                "Aseptojeringa",
                                "Gasitas",
                                "4 campos",
                                "4 agujas hipodérmicas",
                                "2 jeringas de 20 cc",
                                "Cocas",
                                "Miniset número 20"
                            ],
                            suturas: ["Catgut cromado 4/0-5/0 con aguja tres octavo de círculo pequeña", "Vicryl 2/0,3/0 con aguja de medio círculo pequeña"],
                            farmacos: ["Solución salina", "Suero heparinizado (100cc más un centímetro de heparina)"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/priapismo/images/image10.jpg", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/priapismo/images/image1.jpg", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Decúbito supino", imagen: "./assets/planeamientos/priapismo/images/image5.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/priapismo/images/image3.jpg", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia raquídea",
                    anestesiaImagen: "./assets/planeamientos/priapismo/images/image2.jpg",
                    incision: { nombre: "Incisión circunferencial en la base del glande del pene", tipo: "Incisión circunferencial", descripcion: "Incisión circunferencial en la base del glande del pene", imagen: "./assets/planeamientos/priapismo/images/image6.png" },
                    pasos: [
                        { paso: 1, tecnica: "Incisión circunferencial en la base del glande del pene", instrumental: ["Mango bisturí #3", "Hoja de bisturí #15"] },
                        { paso: 2, tecnica: "Resecar la piel dejando descubierto el pene, se expone el cuerpo cavernoso y esponjoso", instrumental: ["Tijera de plastia"] },
                        { paso: 3, tecnica: "Realizar una ventanilla entre el cuerpo esponjoso y cavernoso", instrumental: ["Pinza mosquito curva"] },
                        { paso: 4, tecnica: "Realizar una fístula para que circule la sangre", instrumental: ["Pinza hemostática", "Electrobisturí"] },
                        { paso: 5, tecnica: "Cierre y curación", instrumental: ["Porta agujas de plastia", "Adson sin garra", "Gasas", "Catgut cromado 4/0"] }
                    ]
                }
            }
        }
        ,
        {
            id: 27,
            titulo: "Hipospadias",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "La cirugía de hipospadia tiene como objetivo posicionar el meato uretral en la punta del glande, corregir la curvatura del pene y mejorar su apariencia estética. Esto permite una micción normal y previene problemas futuros como infecciones y dificultades de fertilidad. El procedimiento busca restaurar la función y estética típicas del pene.",
                    anatomia: {
                        titulo: "Anatomía y fisiología del pene",
                        contenido: `El pene es un órgano externo del aparato reproductor masculino compuesto por varias estructuras anatómicas, En su base se encuentra la raíz, que conecta el pene a la pelvis; el cuerpo es la parte media, compuesta por dos cuerpos cavernosos y un cuerpo esponjoso, los cuerpos cavernosos son tejidos cilíndricos que se llenan de sangre para provocar una erección que se extiende hasta el glande, o punta del pene, el glande es la cabeza expandida en el extremo distal del pene, con un orificio uretral externo en su punta. La parte externa mide 8 a 10 cm de largo y 3 cm de diámetro cuando está flácido (sin erección); las dimensiones típicas de un pene erecto son de 13 a 18 cm de largo y 4 cm de diámetro.
Aparato reproductor masculino - Escolar - ABC Color`,
                        imagenes: [
                            "./assets/planeamientos/hipospadias/images/image9.png",
                            "./assets/planeamientos/hipospadias/images/image11.jpg"
                        ],
                        imagenDebajo: "./assets/planeamientos/hipospadias/images/image10.jpg",
                        genitalesExternos: [
                            "Pene (compuesto por 2 cuerpos cavernosos y 1 cuerpo esponjoso) que se encuentra recubierto por el prepucio. Su cabeza se llama glande",
                            "Escroto que recubre los testículos"
                        ],
                        genitalesInternos: [
                            "Testículos: forman las células sexuales o gametos (espermatozoides)",
                            "Epidídimo: donde se entrenan los espermatozoides",
                            "Conducto deferente: Transportan los espermatozoides",
                            "Vesículas Seminales y Próstata: Les dan alimento a los espermatozoides.",
                            "Uretra: Transportan los espermatozoides hacia el exterior a través del pene"
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación",
                        contenido: `El pene está irrigado por ramas de la arteria pudenda interna, que a su vez es una rama de la arteria ilíaca interna. La sangre sale del pene por venas.
ARTERIAS QUE IRRIGAN EL PENE
* Arteria peneana común: Rama de la arteria pudenda interna que irriga las estructuras profundas del pene
* Arteria bulbo uretral: Irriga el bulbo, uretra, cuerpo esponjoso y glande
* Arteria dorsal del pene: Irriga el glande, cuerpo esponjoso y uretra
* Arteria cavernosa: Irriga los cuerpos cavernosos, que se llenan de sangre durante la erección
* Arteria del bulbo del pene: Irriga la porción posterior del cuerpo cavernoso y las glándulas bulbo uretrales

VENAS QUE DRENAN EL PENE
Vena pudenda externa superficial, Vena dorsal profunda del pene.
Función de las arterias en la erección
* Durante la erección, las arterias se dilatan para aumentar el flujo sanguíneo al pene
* La sangre llena los cuerpos cavernosos, lo que produce la erección`,
                        arterias: [
                            "Arteria peneana común: Rama de la arteria pudenda interna que irriga las estructuras profundas del pene",
                            "Arteria bulbo uretral: Irriga el bulbo, uretra, cuerpo esponjoso y glande",
                            "Arteria dorsal del pene: Irriga el glande, cuerpo esponjoso y uretra",
                            "Arteria cavernosa: Irriga los cuerpos cavernosos, que se llenan de sangre durante la erección",
                            "Arteria del bulbo del pene: Irriga la porción posterior del cuerpo cavernoso y las glándulas bulbo uretrales"
                        ],
                        venas: [
                            "Vena pudenda externa superficial",
                            "Vena dorsal profunda del pene"
                        ]
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `INERVACIÓN DEL PENE
* Los nervios pudendos y los nervios cavernosos son los responsables de la inervación del pene
* Los nervios pudendos se encargan de la inervación motora y sensitiva
* Los nervios cavernosos son los responsables de la función eréctil`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `FISIOLOGÍA
La erección es un proceso neurovascular con fases:
* Estimulación: Estímulos sensoriales o mentales activan el sistema parasimpático (S2-S4).
* Liberación de óxido nítrico (NO): El NO relaja el músculo liso de los cuerpos cavernosos.
* Vasodilatación: Aumento del flujo sanguíneo hacia los cuerpos cavernosos.
* Compresión venosa: La sangre queda atrapada al comprimirse las venas, produciendo la erección.

Fisiología de la eyaculación: Tiene dos fases:
* Emisión (control simpático): transporte del semen hacia la uretra prostática.
* Expulsión (control somático): contracciones rítmicas del músculo bulbo cavernoso y otros músculos perineales.

6. Relajación (Detumescencia)
* Tras la eyaculación, se activa el sistema simpático.
* La vasoconstricción reduce el flujo sanguíneo, y el pene retorna a su estado flácido.`,
                        funciones: [
                            { nombre: "Estimulación", descripcion: "Estímulos sensoriales o mentales activan el sistema parasimpático (S2-S4)." },
                            { nombre: "Liberación de óxido nítrico (NO)", descripcion: "El NO relaja el músculo liso de los cuerpos cavernosos." },
                            { nombre: "Vasodilatación", descripcion: "Aumento del flujo sanguíneo hacia los cuerpos cavernosos." },
                            { nombre: "Compresión venosa", descripcion: "La sangre queda atrapada al comprimirse las venas, produciendo la erección." }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta de plastia"],
                            equipos: [
                                "Paquete de ropa",
                                "Electrocauterio + punta pediátrica",
                                "Compresas",
                                "Gasas",
                                "Guantes",
                                "Sonda Nelaton (8-10fr)",
                                "Caucho de succión",
                                "Hoja de bisturí #11-15",
                                "Aguja fina #25"
                            ],
                            suturas: [
                                "Piel y los injertos:",
                                "PDSII 4/0 aguja de ½ circulo punta redonda de 16 mm.",
                                "Seda 2/0 aguja de ½ circulo punta redonda de 26 mm."
                            ],
                            farmacos: ["Suero fisiológico al 0.9%", "Azul de metileno"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/hipospadias/images/image3.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/hipospadias/images/image6.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Decúbito supino (A veces se coloca un soporte bajo la región lumbar para mejorar la exposición de la zona quirúrgica)", imagen: "./assets/planeamientos/hipospadias/images/image8.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/hipospadias/images/image5.jpg", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia raquídea o general",
                    anestesiaImagen: "./assets/planeamientos/hipospadias/images/image1.jpg",
                    incision: { nombre: "Se realiza una incisión longitudinal sobre la placa uretral (en el tejido donde debería estar la uretra). Esto permite que se forme una nueva uretra al tubularizar la placa, alineándola en el centro.", tipo: "Incisión longitudinal sobre la placa uretral", descripcion: "Se realiza una incisión longitudinal sobre la placa uretral (en el tejido donde debería estar la uretra). Esto permite que se forme una nueva uretra al tubularizar la placa, alineándola en el centro.", imagen: "./assets/planeamientos/hipospadias/images/image4.jpg" },
                    pasos: [
                        { paso: 1, tecnica: "Se debe ensayar una erección artificial (maniobra de Horten) inyectando en uno de los cuerpos cavernosos suero fisiológico al 0.9%.", instrumental: ["Aguja fina Nº 25 o un Butterfly", "Suero fisiológico al 0.9%"] },
                        { paso: 2, tecnica: "Demarcación del punto normal de la inserción y del trayecto que se va a incidir", instrumental: ["Azul de metileno"] },
                        { paso: 3, tecnica: "Se realiza la incisión de la piel y de la fascia del pene tomando, reparando y se hace hemostasia hasta llegar a exponer la uretra esponjosa se incide piel, tejido celular subcutáneo y se llega a la fascia de Buck.", instrumental: ["Mango de bisturí 3 con Hoja de bisturí 15", "Pinzas mosquito o baby mosquito curvas"] },
                        { paso: 4, tecnica: "Se Retrae el prepucio hacia adelante o puntos de tracción", instrumental: ["Ganchos de piel", "Portaagujas", "Fibroina 4/0 aguja de ½ circulo punta redonda de 26mm."] },
                        { paso: 5, tecnica: "Sección del prepucio hacia adelante. Extrayendo un colgajo de piel para utilizarlo en la creación del injerto en forma de rectángulo", instrumental: ["Tijera de metzembaum fina o mango de bisturí 3 hoja 15"] },
                        { paso: 6, tecnica: "Se continúa la Incisión de la piel del pene en forma longitudinal hasta el nivel de la fascia estrechada, se secciona esta fascia con el mismo bisturí.", instrumental: ["Mango de bisturí 3 hoja 11"] },
                        { paso: 7, tecnica: "Se realiza el sondaje de la uretra para poder movilizarla hasta el nuevo meato.", instrumental: ["Sonda de Nelaton con calibre adecuado (8-10 fr)"] },
                        { paso: 8, tecnica: "Se realiza el tallaje del injerto o del colgajo para retirar la grasa y piel sobrante, se realiza la tunelizacion. El injerto del prepucio se envuelve y sutura a la sonda.", instrumental: ["PDSII 4/0, 5/0 con aguja punta redonda de 3/8 de circulo de 16mm"] },
                        { paso: 9, tecnica: "Se sutura el injerto en la uretra distal. Si hay necesidad de hacerle un bisel a la uretra.", instrumental: ["PDSII 4/0 - 5/0 aguja de 3/8circulo punta redonda de 16mm.", "Tijera de metzembaum fina."] },
                        { paso: 10, tecnica: "Se hace una incisión en el pene sobre el sitio donde normalmente queda la uretra distal. Luego se fija el injerto.", instrumental: ["Bisturí 3 hoja 11- 15", "Tijera de metzembaum fina", "Pinza de disección Adson con garra"] },
                        { paso: 11, tecnica: "Se realiza hemostasia y se hace cierre por planos con la sutura sobrante.", instrumental: ["PDSII 4/0 aguja de ½ circulo punta redonda de 16mm."] }
                    ]
                }
            }
        }
        ,
        {
            id: 28,
            titulo: "Enfermedad de Peyronie",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Es una afección no cancerosa que resulta de tejido cicatrizal fibroso que se forma en el pene y causa erecciones curvas y dolorosas.",
                    anatomia: {
                        titulo: "Anatomía y fisiología del pene",
                        contenido: `El pene es un órgano externo del aparato reproductor masculino compuesto por varias estructuras anatómicas, En su base se encuentra la raíz, que conecta el pene a la pelvis; el cuerpo es la parte media, compuesta por dos cuerpos cavernosos y un cuerpo esponjoso, los cuerpos cavernosos son tejidos cilíndricos que se llenan de sangre para provocar una erección que se extiende hasta el glande, o punta del pene, el glande es la cabeza expandida en el extremo distal del pene, con un orificio uretral externo en su punta. La parte externa mide 8 a 10 cm de largo y 3 cm de diámetro cuando está flácido (sin erección); las dimensiones típicas de un pene erecto son de 13 a 18 cm de largo y 4 cm de diámetro.
Aparato reproductor masculino - Escolar - ABC Color`,
                        imagenes: [
                            "./assets/planeamientos/enfermedad-de-peyronie/images/image7.png",
                            "./assets/planeamientos/enfermedad-de-peyronie/images/image9.jpg"
                        ],
                        imagenDebajo: "./assets/planeamientos/enfermedad-de-peyronie/images/image8.jpg",
                        genitalesExternos: [
                            "Pene (compuesto por 2 cuerpos cavernosos y 1 cuerpo esponjoso) que se encuentra recubierto por el prepucio. Su cabeza se llama glande",
                            "Escroto que recubre los testículos"
                        ],
                        genitalesInternos: [
                            "Testículos: forman las células sexuales o gametos (espermatozoides)",
                            "Epidídimo: donde se entrenan los espermatozoides",
                            "Conducto deferente: Transportan los espermatozoides",
                            "Vesículas Seminales y Próstata: Les dan alimento a los espermatozoides.",
                            "Uretra: Transportan los espermatozoides hacia el exterior a través del pene"
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación",
                        contenido: `El pene está irrigado por ramas de la arteria pudenda interna, que a su vez es una rama de la arteria ilíaca interna. La sangre sale del pene por venas.
ARTERIAS QUE IRRIGAN EL PENE
* Arteria peneana común: Rama de la arteria pudenda interna que irriga las estructuras profundas del pene
* Arteria bulbo uretral: Irriga el bulbo, uretra, cuerpo esponjoso y glande
* Arteria dorsal del pene: Irriga el glande, cuerpo esponjoso y uretra
* Arteria cavernosa: Irriga los cuerpos cavernosos, que se llenan de sangre durante la erección
* Arteria del bulbo del pene: Irriga la porción posterior del cuerpo cavernoso y las glándulas bulbo uretrales

VENAS QUE DRENAN EL PENE
Vena pudenda externa superficial, Vena dorsal profunda del pene.
Función de las arterias en la erección
* Durante la erección, las arterias se dilatan para aumentar el flujo sanguíneo al pene
* La sangre llena los cuerpos cavernosos, lo que produce la erección`,
                        arterias: [
                            "Arteria peneana común: Rama de la arteria pudenda interna que irriga las estructuras profundas del pene",
                            "Arteria bulbo uretral: Irriga el bulbo, uretra, cuerpo esponjoso y glande",
                            "Arteria dorsal del pene: Irriga el glande, cuerpo esponjoso y uretra",
                            "Arteria cavernosa: Irriga los cuerpos cavernosos, que se llenan de sangre durante la erección",
                            "Arteria del bulbo del pene: Irriga la porción posterior del cuerpo cavernoso y las glándulas bulbo uretrales"
                        ],
                        venas: [
                            "Vena pudenda externa superficial",
                            "Vena dorsal profunda del pene"
                        ]
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `INERVACIÓN DEL PENE
* Los nervios pudendos y los nervios cavernosos son los responsables de la inervación del pene
* Los nervios pudendos se encargan de la inervación motora y sensitiva
* Los nervios cavernosos son los responsables de la función eréctil`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `FISIOLOGÍA
La erección es un proceso neurovascular con fases:
* Estimulación: Estímulos sensoriales o mentales activan el sistema parasimpático (S2-S4).
* Liberación de óxido nítrico (NO): El NO relaja el músculo liso de los cuerpos cavernosos.
* Vasodilatación: Aumento del flujo sanguíneo hacia los cuerpos cavernosos.
* Compresión venosa: La sangre queda atrapada al comprimirse las venas, produciendo la erección.

Fisiología de la eyaculación: Tiene dos fases:
* Emisión (control simpático): transporte del semen hacia la uretra prostática.
* Expulsión (control somático): contracciones rítmicas del músculo bulbo cavernoso y otros músculos perineales.

6. Relajación (Detumescencia)
* Tras la eyaculación, se activa el sistema simpático.
* La vasoconstricción reduce el flujo sanguíneo, y el pene retorna a su estado flácido.`,
                        funciones: [
                            { nombre: "Estimulación", descripcion: "Estímulos sensoriales o mentales activan el sistema parasimpático (S2-S4)." },
                            { nombre: "Liberación de óxido nítrico (NO)", descripcion: "El NO relaja el músculo liso de los cuerpos cavernosos." },
                            { nombre: "Vasodilatación", descripcion: "Aumento del flujo sanguíneo hacia los cuerpos cavernosos." },
                            { nombre: "Compresión venosa", descripcion: "La sangre queda atrapada al comprimirse las venas, produciendo la erección." }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta infantil o mediana"],
                            equipos: [
                                "Paquete de ropa",
                                "Gasas",
                                "Compresas",
                                "Hoja #20",
                                "Aseptojeringa",
                                "Guantes",
                                "Electrobisturí",
                                "Sonda Foley",
                                "Dren de penrose",
                                "Caucho de succión",
                                "Canula de yankawer"
                            ],
                            suturas: [
                                "Uretra:",
                                "Polidioxanona 5/0 o 6/0",
                                "Piel:",
                                "Polipropileno 3/0 ⅜ circulo cortante",
                                "Seda precortada 3/0"
                            ],
                            farmacos: ["Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/enfermedad-de-peyronie/images/image3.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/enfermedad-de-peyronie/images/image1.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Decúbito supino", imagen: "./assets/planeamientos/enfermedad-de-peyronie/images/image6.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/enfermedad-de-peyronie/images/image4.jpg", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia regional",
                    anestesiaImagen: "./assets/planeamientos/enfermedad-de-peyronie/images/image2.jpg",
                    incision: { nombre: "Se realiza una incisión longitudinal sobre la placa uretral (en el tejido donde debería estar la uretra). Esto permite que se forme una nueva uretra al tubularizar la placa, alineándola en el centro.", tipo: "Incisión longitudinal sobre la placa uretral", descripcion: "Se realiza una incisión longitudinal sobre la placa uretral (en el tejido donde debería estar la uretra). Esto permite que se forme una nueva uretra al tubularizar la placa, alineándola en el centro.", imagen: "./assets/planeamientos/enfermedad-de-peyronie/images/image10.png" },
                    pasos: [
                        { paso: 1, tecnica: "Torniquete en la base del pene con un drenaje ajustado con una pinza y erección artificial inyectando suero fisiológico con una aguja en un cuerpo cavernoso", instrumental: ["Pinza kocher", "Dren de Penrose", "Suero fisiológico", "Aguja de mariposa 21G"] },
                        { paso: 2, tecnica: "Una vez apreciada la dirección de la curvatura, la corrección se realiza en el lado opuesto. Si la incurvación es dorsal se realiza ventralmente a ambos lados de la uretra y si es ventral se realiza dorsalmente en ambos cuerpos cavernosos.", instrumental: ["Pinza de disección", "Marcador quirúrgico"] },
                        { paso: 3, tecnica: "Incisión longitudinal bilateral en la fascia de Buck. En plicaturas dorsales se rechazar bien el paquete vasculonervioso hacia la línea media", instrumental: ["Mango de bisturí", "Hoja de bisturí", "Pinzas de disección", "Separadores finos"] },
                        { paso: 4, tecnica: "Colocación en ambos lados de pinzas aplicando la albugínea. Con la erección artificial se comprueba la corrección de la incurvación y si es necesario se realizan plicaturas adicionales con más pinzas", instrumental: ["Ganchos de piel", "Portaagujas", "Pinza Allis"] },
                        { paso: 5, tecnica: "Por cada pinza de Allis se dan 3 puntos invertidos de prolene.", instrumental: ["Prolene 3/0 con aguja triangular"] },
                        { paso: 6, tecnica: "Se provoca una nueva erección artificial para asegurar la corrección de la incurvación.", instrumental: ["Aguja de mariposa 21G", "Suero fisiológico"] },
                        { paso: 7, tecnica: "Técnica de Yachia: incisión longitudinal de 1 cm en la albugínea (sin resección) que se sutura transversalmente", instrumental: ["Portaagujas", "Vicryl 4/0"] },
                        { paso: 8, tecnica: "Técnica de Duckett: 2 incisiones en la albugínea paralelas y transversales de 4 a 6 mm separadas por 8 mm. Sutura con puntos invertidos de los bordes más alejados de cada incisión enterrando el puente de tejido que queda en medio", instrumental: ["Portaagujas", "Prolene 3/0", "Pinza de disección"] },
                        { paso: 9, tecnica: "Cierre de las incisiones longitudinales de la fascia de Buck con sutura absorbible", instrumental: ["Vicryl 4/0"] },
                        { paso: 10, tecnica: "Tras cubrir de nuevo el pene con la piel se cierra el dartos y piel con sutura absorbible", instrumental: ["Vicryl 4/0"] },
                        { paso: 11, tecnica: "Se coloca una Sonda uretral, vendaje del pene con el glande al descubierto para controlar coloración y pene en alto. No se dejan drenajes.", instrumental: ["Sonda Foley", "Apósito"] }
                    ]
                }
            }
        }
        ,
        {
            id: 29,
            titulo: "Circuncisión",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "La circuncisión es una cirugía para quitar el prepucio, la piel que cubre la punta del pene.",
                    anatomia: {
                        titulo: "Anatomía y fisiología del pene",
                        contenido: `El pene es un órgano externo del aparato reproductor masculino compuesto por varias estructuras anatómicas, En su base se encuentra la raíz, que conecta el pene a la pelvis; el cuerpo es la parte media, compuesta por dos cuerpos cavernosos y un cuerpo esponjoso, los cuerpos cavernosos son tejidos cilíndricos que se llenan de sangre para provocar una erección que se extiende hasta el glande, o punta del pene, el glande es la cabeza expandida en el extremo distal del pene, con un orificio uretral externo en su punta. La parte externa mide 8 a 10 cm de largo y 3 cm de diámetro cuando está flácido (sin erección); las dimensiones típicas de un pene erecto son de 13 a 18 cm de largo y 4 cm de diámetro.`,
                        imagenes: [
                            "./assets/planeamientos/circuncision/images/image4.png",
                            "./assets/planeamientos/circuncision/images/image5.jpg"
                        ],
                        imagenDebajo: "./assets/planeamientos/circuncision/images/image1.jpg",
                        genitalesExternos: [
                            "Pene (compuesto por 2 cuerpos cavernosos y 1 cuerpo esponjoso) que se encuentra recubierto por el prepucio. Su cabeza se llama glande",
                            "Escroto que recubre los testículos"
                        ],
                        genitalesInternos: [
                            "Testículos: forman las células sexuales o gametos (espermatozoides)",
                            "Epidídimo: donde se entrenan los espermatozoides",
                            "Conducto deferente: Transportan los espermatozoides",
                            "Vesículas Seminales y Próstata: Les dan alimento a los espermatozoides.",
                            "Uretra: Transportan los espermatozoides hacia el exterior a través del pene"
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación",
                        contenido: `El pene está irrigado por ramas de la arteria pudenda interna, que a su vez es una rama de la arteria ilíaca interna. La sangre sale del pene por venas.
ARTERIAS QUE IRRIGAN EL PENE
* Arteria peneana común: Rama de la arteria pudenda interna que irriga las estructuras profundas del pene
* Arteria bulbo uretral: Irriga el bulbo, uretra, cuerpo esponjoso y glande
* Arteria dorsal del pene: Irriga el glande, cuerpo esponjoso y uretra
* Arteria cavernosa: Irriga los cuerpos cavernosos, que se llenan de sangre durante la erección
* Arteria del bulbo del pene: Irriga la porción posterior del cuerpo cavernoso y las glándulas bulbo uretrales

VENAS QUE DRENAN EL PENE
Vena pudenda externa superficial, Vena dorsal profunda del pene.
Función de las arterias en la erección
* Durante la erección, las arterias se dilatan para aumentar el flujo sanguíneo al pene
* La sangre llena los cuerpos cavernosos, lo que produce la erección`,
                        arterias: [
                            "Arteria peneana común: Rama de la arteria pudenda interna que irriga las estructuras profundas del pene",
                            "Arteria bulbo uretral: Irriga el bulbo, uretra, cuerpo esponjoso y glande",
                            "Arteria dorsal del pene: Irriga el glande, cuerpo esponjoso y uretra",
                            "Arteria cavernosa: Irriga los cuerpos cavernosos, que se llenan de sangre durante la erección",
                            "Arteria del bulbo del pene: Irriga la porción posterior del cuerpo cavernoso y las glándulas bulbo uretrales"
                        ],
                        venas: [
                            "Vena pudenda externa superficial",
                            "Vena dorsal profunda del pene"
                        ]
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `INERVACIÓN DEL PENE
* Los nervios pudendos y los nervios cavernosos son los responsables de la inervación del pene
* Los nervios pudendos se encargan de la inervación motora y sensitiva
* Los nervios cavernosos son los responsables de la función eréctil`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `FISIOLOGÍA
La erección es un proceso neurovascular con fases:
* Estimulación: Estímulos sensoriales o mentales activan el sistema parasimpático (S2-S4).
* Liberación de óxido nítrico (NO): El NO relaja el músculo liso de los cuerpos cavernosos.
* Vasodilatación: Aumento del flujo sanguíneo hacia los cuerpos cavernosos.
* Compresión venosa: La sangre queda atrapada al comprimirse las venas, produciendo la erección.

Fisiología de la eyaculación: Tiene dos fases:
* Emisión (control simpático): transporte del semen hacia la uretra prostática.
* Expulsión (control somático): contracciones rítmicas del músculo bulbo cavernoso y otros músculos perineales.

6. Relajación (Detumescencia)
* Tras la eyaculación, se activa el sistema simpático.
* La vasoconstricción reduce el flujo sanguíneo, y el pene retorna a su estado flácido.`,
                        funciones: [
                            { nombre: "Estimulación", descripcion: "Estímulos sensoriales o mentales activan el sistema parasimpático (S2-S4)." },
                            { nombre: "Liberación de óxido nítrico (NO)", descripcion: "El NO relaja el músculo liso de los cuerpos cavernosos." },
                            { nombre: "Vasodilatación", descripcion: "Aumento del flujo sanguíneo hacia los cuerpos cavernosos." },
                            { nombre: "Compresión venosa", descripcion: "La sangre queda atrapada al comprimirse las venas, produciendo la erección." }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta de plastia"],
                            equipos: [
                                "Paquete de ropa",
                                "Electrobisturi",
                                "Guantes",
                                "Gasas",
                                "H.B #10 (adulto)",
                                "H.B #15 (niños)",
                                "Aseptojeringa",
                                "Compresas",
                                "Caucho de succión",
                                "Canula de yankawer"
                            ],
                            suturas: [
                                "Piel y los injertos:",
                                "Catgut cromado 3/0 aguja de ½ circulo punta redonda. (adulto)",
                                "Catgut cromado 4/0 aguja de ½ circulo punta redonda. (niño)"
                            ],
                            farmacos: ["Suero fisiológico al 0.9%", "Solución salina"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/circuncision/images/image7.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/circuncision/images/image8.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Decúbito supino", imagen: "./assets/planeamientos/circuncision/images/image10.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/circuncision/images/image9.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia general (niños), Anestesia raquídea o bloqueos (adulto)",
                    anestesiaImagen: "./assets/planeamientos/circuncision/images/image2.jpg",
                    incision: { nombre: "Abordaje en pene, prepucio", tipo: "Abordaje en pene, prepucio", descripcion: "Abordaje en pene, prepucio", imagen: "./assets/planeamientos/circuncision/images/image11.png" },
                    pasos: [
                        { paso: 1, tecnica: "Se toma el prepucio y se tracciona hacia arriba", instrumental: ["Pinza mosquito curva"] },
                        { paso: 2, tecnica: "Se delimita la unión coronal sobre la piel y se incide circunferencialmente, siguiendo la “v” del frenillo en la superficie ventral", instrumental: ["M.B #3", "H.B #15"] },
                        { paso: 3, tecnica: "Retracción del prepucio", instrumental: ["Tijeras de plastia"] },
                        { paso: 4, tecnica: "Incisión en la piel y mucosa", instrumental: ["Tijeras plastia", "Disección Adson con garra"] },
                        { paso: 5, tecnica: "Disección de la piel", instrumental: ["Tijeras plastia", "Disección Adson con garra"] },
                        { paso: 6, tecnica: "Se delimitan las adherencias y se realiza la incisión circunferencial en la piel, mucosa justo próximamente al surco coronal", instrumental: ["Tijeras plastia", "Disección Adson con garra"] },
                        { paso: 7, tecnica: "Disección de piel y se retira la piel sobrada entre las dos incisiones y hemostasia", instrumental: ["Tijeras plastia", "Disección Adson con garra", "Electrobisturi"] },
                        { paso: 8, tecnica: "Sutura y curación", instrumental: ["Catgut cromado 4/0 con aguja curva redonda medio circulo pequeña", "Portaagujas", "Tijeras de Mayo", "Gasas"] }
                    ]
                }
            }
        }
        ,
        {
            id: 30,
            titulo: "Cáncer de pene",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "El cáncer de pene es relativamente raro. Se origina habitualmente en el epitelio de la porción interna del prepucio y glande. Es la extirpación quirúrgica del prepucio del pene.",
                    anatomia: {
                        titulo: "Anatomía y fisiología del pene",
                        contenido: `El pene es un órgano externo del aparato reproductor masculino compuesto por varias estructuras anatómicas, En su base se encuentra la raíz, que conecta el pene a la pelvis; el cuerpo es la parte media, compuesta por dos cuerpos cavernosos y un cuerpo esponjoso, los cuerpos cavernosos son tejidos cilíndricos que se llenan de sangre para provocar una erección que se extiende hasta el glande, o punta del pene, el glande es la cabeza expandida en el extremo distal del pene, con un orificio uretral externo en su punta. La parte externa mide 8 a 10 cm de largo y 3 cm de diámetro cuando está flácido (sin erección); las dimensiones típicas de un pene erecto son de 13 a 18 cm de largo y 4 cm de diámetro.
Aparato reproductor masculino - Escolar - ABC Color`,
                        imagenes: [
                            "./assets/planeamientos/cancer-de-pene/images/image8.png",
                            "./assets/planeamientos/cancer-de-pene/images/image10.jpg"
                        ],
                        imagenDebajo: "./assets/planeamientos/cancer-de-pene/images/image9.jpg",
                        genitalesExternos: [
                            "Pene (compuesto por 2 cuerpos cavernosos y 1 cuerpo esponjoso) que se encuentra recubierto por el prepucio. Su cabeza se llama glande",
                            "Escroto que recubre los testículos"
                        ],
                        genitalesInternos: [
                            "Testículos: forman las células sexuales o gametos (espermatozoides)",
                            "Epidídimo: donde se entrenan los espermatozoides",
                            "Conducto deferente: Transportan los espermatozoides",
                            "Vesículas Seminales y Próstata: Les dan alimento a los espermatozoides.",
                            "Uretra: Transportan los espermatozoides hacia el exterior a través del pene"
                        ]
                    },
                    irrigacion: {
                        titulo: "Irrigación",
                        contenido: `El pene está irrigado por ramas de la arteria pudenda interna, que a su vez es una rama de la arteria ilíaca interna. La sangre sale del pene por venas.
ARTERIAS QUE IRRIGAN EL PENE
* Arteria peneana común: Rama de la arteria pudenda interna que irriga las estructuras profundas del pene
* Arteria bulbo uretral: Irriga el bulbo, uretra, cuerpo esponjoso y glande
* Arteria dorsal del pene: Irriga el glande, cuerpo esponjoso y uretra
* Arteria cavernosa: Irriga los cuerpos cavernosos, que se llenan de sangre durante la erección
* Arteria del bulbo del pene: Irriga la porción posterior del cuerpo cavernoso y las glándulas bulbo uretrales

VENAS QUE DRENAN EL PENE
Vena pudenda externa superficial, Vena dorsal profunda del pene.
Función de las arterias en la erección
* Durante la erección, las arterias se dilatan para aumentar el flujo sanguíneo al pene
* La sangre llena los cuerpos cavernosos, lo que produce la erección`,
                        arterias: [
                            "Arteria peneana común: Rama de la arteria pudenda interna que irriga las estructuras profundas del pene",
                            "Arteria bulbo uretral: Irriga el bulbo, uretra, cuerpo esponjoso y glande",
                            "Arteria dorsal del pene: Irriga el glande, cuerpo esponjoso y uretra",
                            "Arteria cavernosa: Irriga los cuerpos cavernosos, que se llenan de sangre durante la erección",
                            "Arteria del bulbo del pene: Irriga la porción posterior del cuerpo cavernoso y las glándulas bulbo uretrales"
                        ],
                        venas: [
                            "Vena pudenda externa superficial",
                            "Vena dorsal profunda del pene"
                        ]
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `INERVACIÓN DEL PENE
* Los nervios pudendos y los nervios cavernosos son los responsables de la inervación del pene
* Los nervios pudendos se encargan de la inervación motora y sensitiva
* Los nervios cavernosos son los responsables de la función eréctil`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `FISIOLOGÍA
La erección es un proceso neurovascular con fases:
* Estimulación: Estímulos sensoriales o mentales activan el sistema parasimpático (S2-S4).
* Liberación de óxido nítrico (NO): El NO relaja el músculo liso de los cuerpos cavernosos.
* Vasodilatación: Aumento del flujo sanguíneo hacia los cuerpos cavernosos.
* Compresión venosa: La sangre queda atrapada al comprimirse las venas, produciendo la erección.

Fisiología de la eyaculación: Tiene dos fases:
* Emisión (control simpático): transporte del semen hacia la uretra prostática.
* Expulsión (control somático): contracciones rítmicas del músculo bulbo cavernoso y otros músculos perineales.

6. Relajación (Detumescencia)
* Tras la eyaculación, se activa el sistema simpático.
* La vasoconstricción reduce el flujo sanguíneo, y el pene retorna a su estado flácido.`,
                        funciones: [
                            { nombre: "Estimulación", descripcion: "Estímulos sensoriales o mentales activan el sistema parasimpático (S2-S4)." },
                            { nombre: "Liberación de óxido nítrico (NO)", descripcion: "El NO relaja el músculo liso de los cuerpos cavernosos." },
                            { nombre: "Vasodilatación", descripcion: "Aumento del flujo sanguíneo hacia los cuerpos cavernosos." },
                            { nombre: "Compresión venosa", descripcion: "La sangre queda atrapada al comprimirse las venas, produciendo la erección." }
                        ]
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta infantil o mediana cirugía"],
                            equipos: [
                                "Paquete de ropa",
                                "Electrobisturi",
                                "Hoja de bisturí #20",
                                "Caucho de succión",
                                "Sonda Foley",
                                "Equipo de venoclisis",
                                "Gasas",
                                "Guantes"
                            ],
                            suturas: [
                                "* Catgut cromado 2/0 4/0 ACR",
                                "* Poliglactina 910 4/0 ACR",
                                "* Nylon 3/0 ACR"
                            ],
                            farmacos: ["Suero fisiológico al 0.9%", "Azul de metileno"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/cancer-de-pene/images/image5.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/cancer-de-pene/images/image1.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Decúbito supino", imagen: "./assets/planeamientos/cancer-de-pene/images/image7.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/cancer-de-pene/images/image2.png", large: true }
                },
                ejecucion: {
                    anestesia: "Epidural",
                    anestesiaImagen: "./assets/planeamientos/cancer-de-pene/images/image3.jpg",
                    incision: { nombre: "Circunferencial a 2cm en relación proximal en el borde deltumor", tipo: "Incisión circunferencial", descripcion: "Circunferencial a 2cm en relación proximal en el borde deltumor", imagen: "./assets/planeamientos/cancer-de-pene/images/image4.jpg" },
                    pasos: [
                        { paso: 1, tecnica: "Aislar la zona", instrumental: ["Cordón o guante quirúrgico"] },
                        { paso: 2, tecnica: "Aplicación de un torniquete en la base del cuello, sin ahorcamiento", instrumental: ["Cordón o guante quirúrgico"] },
                        { paso: 3, tecnica: "Incide la piel en sentido circunferencial a 2cm en relación proximal con el borde del tumor", instrumental: ["Mango bisturí # 3", "Hoja de bisturí # 15"] },
                        { paso: 4, tecnica: "Se ligan las venas superficiales", instrumental: ["Pinza Kelly", "Nylon 3/0 ACR"] },
                        { paso: 5, tecnica: "Seccionar los cuerpos cavernoso sin lesionar el cuerpo esponjoso. Seccionar el cuerpo esponjoso a 3 cm de la sección de los cuerpos cavernosos", instrumental: ["Lapicero Electrobisturí"] },
                        { paso: 6, tecnica: "Se coloca sonda en la uretra", instrumental: ["Sonda Foley"] },
                        { paso: 7, tecnica: "Realizar el cierre del muñón de los cuerpos cavernoso", instrumental: ["Tijera de mayo", "Porta agujas", "Pinza de disección sin garra", "CATGUT CROMADO 2/0 4/0 ACR"] },
                        { paso: 8, tecnica: "Retirar el torniquete hacer hemostasia, se realiza sutura y curación", instrumental: ["Tijera de mayo", "Porta agujas", "Pinza de disección sin garra", "Lápiz electrobisturí", "Poliglactina 910 4/0"] }
                    ]
                }
            }
        }
    ],
    "Próstata": [
        {
            id: 31,
            titulo: "Prostatectomía suprapúbica",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Acceder al adenoma prostático mediante una incisión directa en la cápsula prostática anterior sin entrar en la vejiga, minimizando el trauma vesical.",
                    anatomia: {
                        titulo: "Anatomía y fisiología de la próstata",
                        contenido: `Es una glándula accesoria del sistema reproductor masculino. Es del tamaño de una nuez, y se localiza alrededor de la porción prostática de la uretra (uretra prostática). Anatómicamente, la próstata está compuesta por un istmo, un lóbulo derecho y un lóbulo izquierdo.

1. ISTMO: Se encuentra anterior a la uretra. Está compuesto principalmente por tejido fibroso y muscular, con poco o nulo tejido glandular.

2. LOBULO IZQUIERDO Y DERECHO: Están separados anteriormente por el istmo, y posteriormente por un surco longitudinal que se extiende sobre la línea media de la cara posterior de la próstata. Cada lóbulo está dividido en cuatro lobulillos, con base en sus relaciones anatómicas con el conducto eyaculador y la uretra prostática, que son los siguientes:
* Lobulillo inferoposterior: inferior a la uretra y posterior al conducto eyaculador.
* Lobulillo inferolateral: posicionado lateralmente a la uretra.
* Lobulillo superomedial: por debajo del lobulillo inferoposterior y alrededor del conducto eyaculador.
* Lobulillo anteromedial: inferior al lobulillo inferolateral y lateral a la porción proximal de la uretra prostática.
La próstata consta a su vez de una base, vertice, cara anterior, cara posterior y unas caras inferolaterales. Y a su vez se divide en zonas: una zona central, una zona periférica, zona transicional y estroma fibromuscular anterior

1. Zona central: se encuentra en la base de la próstata, envolviendo los conductos eyaculadores y se conforma por las glándulas submucosas periuretrales
2. Zona transicional: es corta y rodea la porción proximal de la uretra prostática superior al colículo seminal, está formada por las glándulas mucosas periuretrales.
3. Zona periférica: Se compone por las glándulas prostáticas principales`,
                        imagenArriba: "./assets/planeamientos/prostatectomia-suprapubica/images/image3.png",
                        imagenes: [],
                        imagenDebajo: "./assets/planeamientos/prostatectomia-suprapubica/images/image2.png",
                        genitalesExternos: [],
                        genitalesInternos: []
                    },
                    irrigacion: {
                        titulo: "Vascularización",
                        contenido: `La fuente principal de irrigación arterial de la próstata es:
* Arteria pudenda interna, con algunas contribuciones adicionales de las arterias vesical inferior y rectal media`,
                        arterias: [
                            "Arteria pudenda interna",
                            "Arteria vesical inferior",
                            "Arteria rectal media"
                        ],
                        venas: [],
                        imagenDebajo: "./assets/planeamientos/prostatectomia-suprapubica/images/image1.png"
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `Esta inervada por las fibras parasimpáticas de los nervios esplácnicos pélvicos del plexo prostático, que reciben sus fibras del plexo hipogástrico inferior (para erección y efecto secretomotor de acinos), el plexo hipogástrico inferior a su vez recibe fibras simpáticas preganglionares del plexo hipogástrico superior para brindar inervación motora a los músculos lisos del estroma glandular (para eyaculación y contracción muscular lisa).`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `Su función es la de producir el fluido prostático, que, en combinación con el esperma proveniente de los testículos, componen el semen y a su vez la función principal del fluido prostático es activar a las células espermáticas, por lo que asiste en el proceso general de la reproducción.`,
                        funciones: []
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: ["Canasta general"],
                            equipos: [
                                "Paquete de ropa",
                                "Pala larga del electrobisturí",
                                "Cánula de Yankauer",
                                "Guantes",
                                "Torundas",
                                "Disectores",
                                "Gasas",
                                "Apósito",
                                "HBF #20, II y 15",
                                "Electrobisturí",
                                "Consola del electro",
                                "Caucho de succión",
                                "Mango de bisturí 3 y 4",
                                "Cystoflo",
                                "Frasco de patología",
                                "Dren de Penrose ancho",
                                "jeringa de 20 y 60 cc punta catéter",
                                "Sondas de Foley #22 y #24 de 2 y 3 vías, mecha prostática, cistoflo, sondas Nelaton 6, Uromatic, equipo macrogoteo"
                            ],
                            suturas: [
                                "Piel: Nylon 2/0 SC26 o 3/0 SC24",
                                "TCS y músculo: C/C 0 o 2/0 CTI",
                                "Fascia: Vicryl 1 CTI",
                                "Vejiga: C/C 0 2/0 CTI",
                                "Lecho prostático: C/C 1 CTI",
                                "Fijar sonda: Seda 2/0 SC26"
                            ],
                            farmacos: ["Suero fisiológico o agua estéril", "Xilocaína Jalea"]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/prostatectomia-suprapubica/images/image6.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/prostatectomia-suprapubica/images/image5.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Posición de trendelemburg moderada", descripcion: "Posición de trendelemburg moderada", imagen: "./assets/planeamientos/prostatectomia-suprapubica/images/image8.jpg", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/prostatectomia-suprapubica/images/image7.png", large: true }
                },
                ejecucion: {
                    anestesia: "Raquídea",
                    anestesiaImagen: "",
                    incision: { nombre: "Incisión Pfannestiel", tipo: "Incisión Pfannestiel", descripcion: "Incisión Pfannestiel", imagen: null },
                    pasos: [
                        { paso: 1, tecnica: "Se realiza incisión Pfannestiel en la piel, tejido celular subcutáneo", instrumental: ["Mango de bisturí 4 con hoja 20"] },
                        { paso: 2, tecnica: "Se realiza hemostasia", instrumental: ["Pinza Kelly curva", "Lapicero del electrobisturí"] },
                        { paso: 3, tecnica: "Se visualiza la fascia", instrumental: ["Separadores de farabeuf"] },
                        { paso: 4, tecnica: "Se realiza la divulsión de los músculos y se visualiza la cavidad extraperitoneal", instrumental: ["Pinza Kelly curva", "Separadores deaver anchos"] },
                        { paso: 5, tecnica: "Se rechaza la vejiga", instrumental: ["Valva maleable"] },
                        { paso: 6, tecnica: "Se diseccionan los vasos superficiales y los ligamentos pubo prostáticos, se clampean y se ligan", instrumental: ["Pinza cístico", "Kelly adson", "Poliglactina 910 calibre 0 ½"] },
                        { paso: 7, tecnica: "Se incide una y luego se hace la disección de la fascia endopelvica", instrumental: ["Tijeras de metzenbaum"] },
                        { paso: 8, tecnica: "Se clampea la vena dorsal del pene a través de la fascia Endo pélvica", instrumental: ["Pinza cístico-larga"] },
                        { paso: 9, tecnica: "Se realiza ligadura", instrumental: ["Seda 0 sin aguja"] },
                        { paso: 10, tecnica: "Haciendo sección de la vena dorsal del pene y los ligamentos pubo prostáticos se identifica la uretra", instrumental: ["Mango bisturí 3 con hoja 15", "Tijeras de metzenbaum", "Disección vascular", "Pinza cístico", "Pinza Kelly adson"] },
                        { paso: 11, tecnica: "Se realiza disección de la próstata hacia abajo y se visualiza la unión prostática uretral", instrumental: ["Pinza Rochester recta", "Torundas"] },
                        { paso: 12, tecnica: "Se realiza sección de la uretra con la sonda se repara, se tracciona la capsula y se lleva hacia atrás", instrumental: ["Tijeras finas", "Sonda foley", "Pinza cístico"] },
                        { paso: 13, tecnica: "Se realiza liberación de las adherencias de los músculos elevadores del ano y rectales", instrumental: ["Pinza foerster", "Pinza pennington"] },
                        { paso: 14, tecnica: "Se reparan los musculos elevadores del ano", instrumental: ["Pinza Kelly curva", "Poliglactina 910 ACR ½ circulo"] },
                        { paso: 15, tecnica: "Se realiza liberación de la próstata y se corta a nivel del cuello y vejiga", instrumental: ["Tijeras de metzenbaum", "Mango de bisturí 3 largo con hoja de bisturí 15"] },
                        { paso: 16, tecnica: "Se realiza la disección roma en la pared prostática y vejiga para poder encontrar las vesículas seminales", instrumental: ["Pinzas Rochester"] },
                        { paso: 17, tecnica: "Se realiza la sección de los conductos deferentes", instrumental: ["Tijeras de metzenbaum", "Torunda"] },
                        { paso: 18, tecnica: "Se realiza la ligadura de los pedículos seminales", instrumental: ["Pinza Kelly adson", "Pinza cístico", "Sutura natural no absorbible trenzada 2/0"] },
                        { paso: 19, tecnica: "Se realiza la plastia del cuello vesical", instrumental: ["Portaagujas largo", "Pinza de disección larga", "Catgut cromado 3/0 aguja ½ circulo redonda"] },
                        { paso: 20, tecnica: "Se realiza anastomosis del cuello vesical de la uretra", instrumental: ["Portaagujas largo", "Pinza de disección larga", "Catgut cromado 2/0 aguja curva ½ circulo redonda"] },
                        { paso: 21, tecnica: "Se coloca una segunda sonda Foley 22X30 y se anudan los reparos anteriores", instrumental: ["Jeringa 20 cc", "Equipo de venoclisis", "Solución salina"] },
                        { paso: 22, tecnica: "Se deja un dren por contraabertura", instrumental: ["Pinzas Rochester"] },
                        { paso: 23, tecnica: "Se realiza hemostasia y recuento", instrumental: ["Pinza foerster"] },
                        { paso: 24, tecnica: "Se cierra por planos", instrumental: ["Portaagujas mediano", "Pinza de disección con garra", "Separadores de Farabeuf", "Disección adson con garra", "Sutura sintética absorbible calibre 1 agua ½ circulo redonda", "Polipropileno 3/0 aguja curva de 3/8 de circulo cortante"] }
                    ]
                }
            }
        },
        {
            id: 32,
            titulo: "Prostatectomía radical con linfadenectomía",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Realizar la resección completa de la próstata y vesículas seminales asociada a linfadenectomía pélvica, con el fin de lograr control oncológico local, estadificación ganglionar adecuada y disminución del riesgo de progresión tumoral.",
                    anatomia: {
                        titulo: "Anatomía y fisiología de la próstata",
                        contenido: `Es una glándula accesoria del sistema reproductor masculino. Es del tamaño de una nuez, y se localiza alrededor de la porción prostática de la uretra (uretra prostática). Anatómicamente, la próstata está compuesta por un istmo, un lóbulo derecho y un lóbulo izquierdo.

1. ISTMO: Se encuentra anterior a la uretra. Está compuesto principalmente por tejido fibroso y muscular, con poco o nulo tejido glandular.

2. LOBULO IZQUIERDO Y DERECHO: Están separados anteriormente por el istmo, y posteriormente por un surco longitudinal que se extiende sobre la línea media de la cara posterior de la próstata. Cada lóbulo está dividido en cuatro lobulillos, con base en sus relaciones anatómicas con el conducto eyaculador y la uretra prostática, que son los siguientes:
• Lobulillo inferoposterior: inferior a la uretra y posterior al conducto eyaculador.
• Lobulillo inferolateral: posicionado lateralmente a la uretra.
• Lobulillo superomedial: por debajo del lobulillo inferoposterior y alrededor del conducto eyaculador.
• Lobulillo anteromedial: inferior al lobulillo inferolateral y lateral a la porción proximal de la uretra prostática.
La próstata consta a su vez de una base, vertice, cara anterior, cara posterior y unas caras inferolaterales. Y a su vez se divide en zonas: una zona central, una zona periférica, zona transicional y estroma fibromuscular anterior

1. Zona central: se encuentra en la base de la próstata, envolviendo los conductos eyaculadores y se conforma por las glándulas submucosas periuretrales
2. Zona transicional: es corta y rodea la porción proximal de la uretra prostática superior al colículo seminal, está formada por las glándulas mucosas periuretrales.
3. Zona periférica: Se compone por las glándulas prostáticas principales`,
                        imagenArriba: "./assets/planeamientos/prostatectomia-radical-con-linfadenectomia/images/image3.png",
                        imagenes: [],
                        imagenDebajo: "./assets/planeamientos/prostatectomia-radical-con-linfadenectomia/images/image2.png",
                        genitalesExternos: [],
                        genitalesInternos: []
                    },
                    irrigacion: {
                        titulo: "Vascularización",
                        contenido: `La fuente principal de irrigación arterial de la próstata es:
• Arteria pudenda interna, con algunas contribuciones adicionales de las arterias vesical inferior y rectal media`,
                        arterias: [
                            "Arteria pudenda interna",
                            "Arteria vesical inferior",
                            "Arteria rectal media"
                        ],
                        venas: [],
                        imagenDebajo: "./assets/planeamientos/prostatectomia-radical-con-linfadenectomia/images/image1.png"
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `Esta inervada por las fibras parasimpáticas de los nervios esplácnicos pélvicos del plexo prostático, que reciben sus fibras del plexo hipogástrico inferior (para erección y efecto secretomotor de acinos), el plexo hipogástrico inferior a su vez recibe fibras simpáticas preganglionares del plexo hipogástrico superior para brindar inervación motora a los músculos lisos del estroma glandular (para eyaculación y contracción muscular lisa).`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `Su función es la de producir el fluido prostático, que, en combinación con el esperma proveniente de los testículos, componen el semen y a su vez la función principal del fluido prostático es activar a las células espermáticas, por lo que asiste en el proceso general de la reproducción.`,
                        funciones: []
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: [
                                "Canasta general",
                                "Canasta Vascular",
                                "Pinza hemolock de 10",
                                "Pinza hemolock de 5",
                                "Espátula larga para electrobisturí",
                                "Tijera de metzenbaum extralarga",
                                "Manubrios",
                                "Pinza ligaclip"
                            ],
                            equipos: [
                                "Paquete de ropa general",
                                "Compresas",
                                "Sabana",
                                "Bata accesoria",
                                "Guantes",
                                "Sonda Foley 22x30",
                                "Gasas",
                                "Sharpie",
                                "Tapones para sonda",
                                "Aseptojeringa",
                                "Hoja de bisturí 15, 20",
                                "Jeringa 20 cc",
                                "Canula de Yankawer",
                                "Dren de blake o pen rose"
                            ],
                            suturas: [
                                "PIEL: Polipropileno 3/0 ACC 3/8",
                                "FASCIA: Poliglactina 0 o 1 ACR ½",
                                "LECHO PROSTATICO: Catgut cromado 2/0 ACR ½",
                                "ANASTOMOSIS: Poliglactina 910 2/0 ACR ½",
                                "GANGLIOS LINFATICOS: Ligaclip, seda 2/0 o 3/0 precortada",
                                "FIJACION DRENES: Seda 2/0"
                            ],
                            farmacos: [
                                "Solución Salina",
                                "Xilocaína Jalea",
                                "Azul de metileno",
                                "Bupivacaina al 0,5 % con epinefrina"
                            ]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [
                        "1. Mango de bisturí #4 – hoja 20",
                        "2. Mango de bisturí #3 largo – hoja 15",
                        "3. Tijeras de Metzenbaum",
                        "4. Tijera de Mayo",
                        "5. Pinzas Kelly curva",
                        "6. Pinzas Kelly recta",
                        "7. Pinza Kelly Adson",
                        "8. Pinza Rochester curva",
                        "9. Pinza Rochester recta",
                        "10. Separadores de Farabeuf",
                        "11. Pinzas Allix",
                        "12. Pinzas de disección rusa",
                        "13. Pinza de disección sin garra larga",
                        "14. Pinza de disección sin garra corta",
                        "15. Pinza de disección con garra corta",
                        "16. Pinza Adson con garra"
                    ], imagen: "./assets/planeamientos/prostatectomia-radical-con-linfadenectomia/images/image6.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [
                        "1. Equipo general",
                        "2. Coca",
                        "3. Valva maleable",
                        "4. Separador deaver angosto",
                        "5. Pinzas cístico",
                        "6. Clamp de satinsky",
                        "7. Clamp de debakey",
                        "8. Coca con suero",
                        "9. Canula de yankawer",
                        "10. Portaagujas",
                        "11. Suturas",
                        "12. Tijera de metzenbaum larga",
                        "13. Tijera de mayo larga",
                        "14. Pinza foerster",
                        "15. Pinza de campo",
                        "16. Compresas",
                        "17. Electrobisturi",
                        "18. Paquete de ropa",
                        "19. Guantes",
                        "20. Caucho de succion"
                    ], imagen: "./assets/planeamientos/prostatectomia-radical-con-linfadenectomia/images/image5.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Decúbito supino", descripcion: "Decúbito supino", imagen: "./assets/planeamientos/prostatectomia-radical-con-linfadenectomia/images/image9.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/prostatectomia-radical-con-linfadenectomia/images/image7.png", large: true }
                },
                ejecucion: {
                    anestesia: "General o regional",
                    anestesiaImagen: "./assets/planeamientos/prostatectomia-radical-con-linfadenectomia/images/image8.png",
                    incision: { nombre: "Incisión mediana infraumbilical", tipo: "Incisión mediana infraumbilical", descripcion: "Incisión mediana infraumbilical de la piel, tejido celular subcutáneo", imagen: null },
                    pasos: [
                        { paso: 1, tecnica: "Se realiza incisión mediana infraumbilical de la piel, tejido celular subcutáneo", instrumental: ["Mango de bisturí 4 con hoja 20"] },
                        { paso: 2, tecnica: "Se realiza hemostasia", instrumental: ["Pinza Kelly curva", "Lapicero del electrobisturí"] },
                        { paso: 3, tecnica: "Se visualiza la fascia", instrumental: ["Separadores de farabeuf"] },
                        { paso: 4, tecnica: "Se realiza la divulsión de los músculos y se visualiza la cavidad extraperitoneal", instrumental: ["Pinza Kelly curva", "Separadores deaver anchos"] },
                        { paso: 5, tecnica: "Se realiza la linfadenectomía de vasos iliacos, hipogástricos bilaterales, y aórticos", instrumental: ["Pinza Kelly curva", "Tijeras de metzenbaum", "Separador de vanea", "Liga clips", "Torundas", "Frasco de patología"] },
                        { paso: 6, tecnica: "Se rechaza la vejiga", instrumental: ["Valva maleable"] },
                        { paso: 7, tecnica: "Se diseccionan los vasos superficiales y los ligamentos pubo prostáticos, se clampean y se ligan", instrumental: ["Pinza cístico", "Kelly adson", "Poliglactina 910 calibre 0 ½"] },
                        { paso: 8, tecnica: "Se incide una y luego se hace la disección de la fascia endopelvica", instrumental: ["Tijeras de metzenbaum"] },
                        { paso: 9, tecnica: "Se clampea la vena dorsal del pene a través de la fascia Endo pélvica", instrumental: ["Pinza cístico-larga"] },
                        { paso: 10, tecnica: "Se realiza ligadura", instrumental: ["Seda 0 sin aguja"] },
                        { paso: 11, tecnica: "Haciendo sección de la vena dorsal del pene y los ligamentos pubo prostáticos se identifica la uretra", instrumental: ["Mango bisturí 3 con hoja 15", "Tijeras de metzenbaum", "Disección vascular", "Pinza cístico", "Pinza Kelly adson"] },
                        { paso: 12, tecnica: "Se realiza disección de la próstata hacia abajo y se visualiza la unión prostática uretral", instrumental: ["Pinza Rochester recta", "Torundas"] },
                        { paso: 13, tecnica: "Se realiza sección de la uretra con la sonda se repara, se tracciona la capsula y se lleva hacia atrás", instrumental: ["Tijeras finas", "Sonda foley", "Pinza cístico"] },
                        { paso: 14, tecnica: "Se realiza liberación de las adherencias de los músculos elevadores del ano y rectales", instrumental: ["Pinza foerster", "Pinza pennington"] },
                        { paso: 15, tecnica: "Se reparan los musculos elevadores del ano", instrumental: ["Pinza Kelly curva", "Poliglactina 910 ACR ½ circulo"] },
                        { paso: 16, tecnica: "Se realiza liberación de la próstata y se corta a nivel del cuello y vejiga", instrumental: ["Tijeras de metzenbaum", "Mango de bisturí 3 largo con hoja de bisturí 15"] },
                        { paso: 17, tecnica: "Se realiza la disección roma en la pared prostática y vejiga para poder encontrar las vesículas seminales", instrumental: ["Pinzas Rochester"] },
                        { paso: 18, tecnica: "Se realiza la sección de los conductos deferentes", instrumental: ["Tijeras de metzenbaum", "Torunda"] },
                        { paso: 19, tecnica: "Se realiza la ligadura de los pedículos seminales", instrumental: ["Pinza Kelly adson", "Pinza cístico", "Sutura natural no absorbible trenzada 2/0"] },
                        { paso: 20, tecnica: "Se realiza la plastia del cuello vesical", instrumental: ["Portaagujas largo", "Pinza de disección larga", "Catgut cromado 3/0 aguja ½ circulo redonda"] },
                        { paso: 21, tecnica: "Se realiza anastomosis del cuello vesical de la uretra", instrumental: ["Portaagujas largo", "Pinza de disección larga", "Catgut cromado 2/0 aguja curva ½ circulo redonda"] },
                        { paso: 22, tecnica: "Se coloca una segunda sonda Foley 22X30 y se anudan los reparos anteriores", instrumental: ["Jeringa 20 cc", "Equipo de venoclisis", "Solución salina"] },
                        { paso: 23, tecnica: "Se deja un dren por contraabertura", instrumental: ["Pinzas Rochester"] },
                        { paso: 24, tecnica: "Se realiza hemostasia y recuento", instrumental: ["Pinza foerster"] },
                        { paso: 25, tecnica: "Se cierra por planos", instrumental: ["Portaagujas mediano", "Pinza de disección con garra", "Separadores de Farabeuf", "Disección adson con garra", "Sutura sintética absorbible calibre 1 agua ½ circulo redonda", "Polipropileno 3/0 aguja curva de 3/8 de circulo cortante"] }
                    ]
                }
            }
        },
        {
            id: 33,
            titulo: "Prostatectomía convencional y bipolar",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Eliminar el tejido prostático obstructivo mediante abordaje endoscópico para restablecer la función miccional normal del paciente.",
                    anatomia: {
                        titulo: "Anatomía y fisiología de la próstata",
                        contenido: `Es una glándula accesoria del sistema reproductor masculino. Es del tamaño de una nuez, y se localiza alrededor de la porción prostática de la uretra (uretra prostática). Anatómicamente, la próstata está compuesta por un istmo, un lóbulo derecho y un lóbulo izquierdo.

1. ISTMO: Se encuentra anterior a la uretra. Está compuesto principalmente por tejido fibroso y muscular, con poco o nulo tejido glandular.

2. LOBULO IZQUIERDO Y DERECHO: Están separados anteriormente por el istmo, y posteriormente por un surco longitudinal que se extiende sobre la línea media de la cara posterior de la próstata. Cada lóbulo está dividido en cuatro lobulillos, con base en sus relaciones anatómicas con el conducto eyaculador y la uretra prostática, que son los siguientes:
• Lobulillo inferoposterior: inferior a la uretra y posterior al conducto eyaculador.
• Lobulillo inferolateral: posicionado lateralmente a la uretra.
• Lobulillo superomedial: por debajo del lobulillo inferoposterior y alrededor del conducto eyaculador.
• Lobulillo anteromedial: inferior al lobulillo inferolateral y lateral a la porción proximal de la uretra prostática.
La próstata consta a su vez de una base, vertice, cara anterior, cara posterior y unas caras inferolaterales. Y a su vez se divide en zonas: una zona central, una zona periférica, zona transicional y estroma fibromuscular anterior

1. Zona central: se encuentra en la base de la próstata, envolviendo los conductos eyaculadores y se conforma por las glándulas submucosas periuretrales
2. Zona transicional: es corta y rodea la porción proximal de la uretra prostática superior al colículo seminal, está formada por las glándulas mucosas periuretrales.
3. Zona periférica: Se compone por las glándulas prostáticas principales`,
                        imagenArriba: "./assets/planeamientos/prostatectomia-convencional-y-bipolar/images/image3.png",
                        imagenes: [],
                        imagenDebajo: "./assets/planeamientos/prostatectomia-convencional-y-bipolar/images/image2.png",
                        genitalesExternos: [],
                        genitalesInternos: []
                    },
                    irrigacion: {
                        titulo: "Vascularización",
                        contenido: `La fuente principal de irrigación arterial de la próstata es:
• Arteria pudenda interna, con algunas contribuciones adicionales de las arterias vesical inferior y rectal media`,
                        arterias: [
                            "Arteria pudenda interna",
                            "Arteria vesical inferior",
                            "Arteria rectal media"
                        ],
                        venas: [],
                        imagenDebajo: "./assets/planeamientos/prostatectomia-convencional-y-bipolar/images/image1.png"
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `Esta inervada por las fibras parasimpáticas de los nervios esplácnicos pélvicos del plexo prostático, que reciben sus fibras del plexo hipogástrico inferior (para erección y efecto secretomotor de acinos), el plexo hipogástrico inferior a su vez recibe fibras simpáticas preganglionares del plexo hipogástrico superior para brindar inervación motora a los músculos lisos del estroma glandular (para eyaculación y contracción muscular lisa).`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `Su función es la de producir el fluido prostático, que, en combinación con el esperma proveniente de los testículos, componen el semen y a su vez la función principal del fluido prostático es activar a las células espermáticas, por lo que asiste en el proceso general de la reproducción.`,
                        funciones: []
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: [
                                "Resectoscopio Sonda",
                                "Óptica de 30° de alta definición (Monopolar/Bipolar)",
                                "Asa de coagulación",
                                "Cámara con cabezal de video",
                                "Cable de Fibra Óptica (Fuente de luz)"
                            ],
                            equipos: [
                                "Sonda Foley de 3 vías (22 o 24 Fr)",
                                "Paquete de ropa general",
                                "Compresas",
                                "Sabana",
                                "Bata accesoria",
                                "Guantes",
                                "Gasas",
                                "Canula de Yankawer",
                                "Set de irrigación en Y (Alto flujo)",
                                "Evacuador de Ellik o Jeringa de Toomey",
                                "Cystoflo",
                                "Placa de electrobisturí (Solo si es Monopolar)",
                                "Cable de corriente (Alta frecuencia)",
                                "Frasco para Patología con Formol"
                            ],
                            suturas: [],
                            farmacos: [
                                "Bolsas de Glicina o Salino (3000cc)",
                                "Lidocaína jalea"
                            ]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: null,
                    mesaReserva: { titulo: "Mesa de Reserva", descripcion: "", items: [
                        "Camisa (vaina) del resectoscopio con su obturador",
                        "Elemento de trabajo (Iglesias o Nesbit)",
                        "Ópticas (0° y 30°)",
                        "Asas de energía: Asa de corte y asa de coagulación (debidamente protegidas para que no se doblen)",
                        "Cable de fibra óptica",
                        "Cable de alta frecuencia (monopolar o bipolar)",
                        "Lidocaína en jalea (en una jeringa de 10cc o jeringa prellenada)",
                        "Evacuador de Ellik o jeringa de Toomey llena de líquido de irrigación",
                        "Gasas pequeñas para limpieza de la óptica",
                        "Sonda Foley de 3 vías (lista para el final)"
                    ], imagen: "./assets/planeamientos/prostatectomia-convencional-y-bipolar/images/image5.jpg", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Litotomía", descripcion: "Litotomía", imagen: "./assets/planeamientos/prostatectomia-convencional-y-bipolar/images/image4.jpg", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/prostatectomia-convencional-y-bipolar/images/image6.jpg", large: true }
                },
                ejecucion: {
                    anestesia: "Raquídea",
                    anestesiaImagen: "",
                    incision: { nombre: "Abordaje Transuretral", tipo: "Abordaje Transuretral", descripcion: "Abordaje Transuretral", imagen: null },
                    pasos: [
                        { paso: 1, tecnica: "Lubricar con jalea de lidocaína. Verificar fuente de luz y cámara", instrumental: ["Óptica de 0° o 30°", "Puente de cistoscopia", "Vaina"] },
                        { paso: 2, tecnica: "Introducción bajo visión directa o a ciegas según cirujano", instrumental: ["Camisa de resectoscopio (24-26 Fr)", "Obturador"] },
                        { paso: 3, tecnica: "Identificar el veru montanum y cuello vesical", instrumental: ["Elemento de trabajo (Iglesias)", "Óptica", "Asa de corte"] },
                        { paso: 4, tecnica: "Convencional: Usar Glicina. Bipolar: Usar Solución Salina", instrumental: ["Asa de corte (U)", "Unidad electroquirúrgica"] },
                        { paso: 5, tecnica: "Controlar vasos sangrantes para mantener la visibilidad", instrumental: ["Asa de coagulación", "Asa Roller Ball"] },
                        { paso: 6, tecnica: "Aspirar los chips de próstata del interior de la vejiga", instrumental: ["Evacuador de Ellik", "Jeringa de Toomey"] },
                        { paso: 7, tecnica: "Conteo de líquidos (balance hídrico) para evitar síndrome de RTU", instrumental: ["Camisa del resectoscopio", "Óptica"] },
                        { paso: 8, tecnica: "Inflar balón (30-50cc) e iniciar irrigación continua (cistoclisis)", instrumental: ["Sonda Foley de 3 vías (22-24 Fr)"] }
                    ]
                }
            }
        },
        {
            id: 34,
            titulo: "Prostatectomía abierta transvesical",
            tipo: "planeamiento-complejo",
            etapas: {
                planeacion: {
                    objetivo: "Extirpar de forma completa el adenoma prostático de gran volumen a través de un abordaje transverso abierto para eliminar la obstrucción del tracto urinario inferior.",
                    anatomia: {
                        titulo: "Anatomía y fisiología de la próstata",
                        contenido: `Es una glándula accesoria del sistema reproductor masculino. Es del tamaño de una nuez, y se localiza alrededor de la porción prostática de la uretra (uretra prostática). Anatómicamente, la próstata está compuesta por un istmo, un lóbulo derecho y un lóbulo izquierdo.

1. ISTMO: Se encuentra anterior a la uretra. Está compuesto principalmente por tejido fibroso y muscular, con poco o nulo tejido glandular.

2. LÓBULO IZQUIERDO Y DERECHO: Están separados anteriormente por el istmo, y posteriormente por un surco longitudinal que se extiende sobre la línea media de la cara posterior de la próstata. Cada lóbulo está dividido en cuatro lobulillos, con base en sus relaciones anatómicas con el conducto eyaculador y la uretra prostática, que son los siguientes:
* Lobulillo inferoposterior: inferior a la uretra y posterior al conducto eyaculador.
* Lobulillo inferolateral: posicionado lateralmente a la uretra.
* Lobulillo superomedial: por debajo del lobulillo inferoposterior y alrededor del conducto eyaculador.
* Lobulillo anteromedial: inferior al lobulillo inferolateral y lateral a la porción proximal de la uretra prostática.

La próstata consta a su vez de una base, vértice, cara anterior, cara posterior y unas caras inferolaterales. Y a su vez se divide en zonas: una zona central, una zona periférica, zona transicional y estroma fibromuscular anterior

1. Zona central: se encuentra en la base de la próstata, envolviendo los conductos eyaculadores y se conforma por las glándulas submucosas periuretrales
2. Zona transicional: es corta y rodea la porción proximal de la uretra prostática superior al colículo seminal, está formada por las glándulas mucosas periuretrales.
3. Zona periférica: Se compone por las glándulas prostáticas principales`,
                        imagenArriba: "./assets/planeamientos/prostatectomia-abierta-transvesical/images/image59.png",
                        imagenes: [],
                        imagenDebajo: "./assets/planeamientos/prostatectomia-abierta-transvesical/images/image29.png",
                        genitalesExternos: [],
                        genitalesInternos: []
                    },
                    irrigacion: {
                        titulo: "Vascularización",
                        contenido: `La fuente principal de irrigación arterial de la próstata es:
* Arteria pudenda interna, con algunas contribuciones adicionales de las arterias vesical inferior y rectal media

DRENAJE VENOSO:
El drenaje venoso se realiza a través del plexo venoso prostático, que conduce la sangre hacia las venas ilíacas internas.`,
                        arterias: [
                            "Arteria pudenda interna",
                            "Arteria vesical inferior",
                            "Arteria rectal media"
                        ],
                        venas: [
                            "Plexo venoso prostático hacia venas ilíacas internas"
                        ],
                        imagen: "./assets/planeamientos/prostatectomia-abierta-transvesical/images/image43.png",
                        imagenDebajo: "./assets/planeamientos/prostatectomia-abierta-transvesical/images/image45.png"
                    },
                    inervacion: {
                        titulo: "Inervación",
                        contenido: `Esta inervada por las fibras parasimpáticas de los nervios esplácnicos pélvicos del plexo prostático, que reciben sus fibras del plexo hipogástrico inferior (para erección y efecto secretomotor de acinos), el plexo hipogástrico inferior a su vez recibe fibras simpáticas preganglionares del plexo hipogástrico superior para brindar inervación motora a los músculos lisos del estroma glandular (para eyaculación y contracción muscular lisa).`
                    },
                    fisiologia: {
                        titulo: "Fisiología",
                        contenido: `Su función es la de producir el fluido prostático, que, en combinación con el esperma proveniente de los testículos, componen el semen y a su vez la función principal del fluido prostático es activar a las células espermáticas, por lo que asiste en el proceso general de la reproducción.`,
                        funciones: []
                    },
                    checklist: {
                        titulo: "Lista de chequeo",
                        categorias: {
                            instrumental: [
                                "Canasta general",
                                "Canasta de urología",
                                "Separador de Judd-Mason",
                                "Pinza Heany",
                                "Rochester Pean",
                                "Valva suprapúbica"
                            ],
                            equipos: [
                                "Paquete de ropa",
                                "Dren de Jackson-Pratt",
                                "Pala larga del electrobisturí",
                                "Aseptojeringa",
                                "Cánula de Yankauer",
                                "Electrobisturí",
                                "Consola del electro",
                                "Caucho de succión",
                                "Hoja de bisturí #15 - #20",
                                "Mango de bisturí 3 y 4",
                                "Jeringa de 10cc",
                                "Cystoflo",
                                "Guantes",
                                "Frasco de patología",
                                "Equipo de venoclisis",
                                "Compresas y apósitos",
                                "Sonda Foley de 3 vías 22-24",
                                "Equipo de irrigación en Y"
                            ],
                            suturas: [
                                "PIEL: Polipropileno 2/0 Aguja curva cortante 3/8 de círculo",
                                "TEJIDO CELULAR SUBCUTÁNEO: Poliglactina 910 2/0 Aguja curva redonda ½ de círculo",
                                "FASCIA: Poliglactina 910 0 -1 Aguja curva redonda ½ de círculo",
                                "LECHO PROSTÁTICO: Poliglactina 910 0- 2/0 Aguja curva redonda 1/2 de círculo",
                                "Seda 2/0 precortada"
                            ],
                            farmacos: [
                                "Solución Salina",
                                "Lidocaina jalea",
                                "Surgicel"
                            ]
                        }
                    }
                },
                organizacion: {
                    mesaMayo: { titulo: "Mesa de Mayo", items: [], imagen: "./assets/planeamientos/prostatectomia-abierta-transvesical/images/image1.png", large: true },
                    mesaReserva: { titulo: "Mesa de Reserva", items: [], imagen: "./assets/planeamientos/prostatectomia-abierta-transvesical/images/image3.png", large: true },
                    posicionPaciente: { titulo: "Posición del paciente", nombre: "Posición Decúbito supino", descripcion: "Posición Decúbito supino", imagen: "./assets/planeamientos/prostatectomia-abierta-transvesical/images/image19.png", large: true },
                    equipoQuirurgico: { titulo: "Ubicación del equipo quirúrgico", roles: [], imagen: "./assets/planeamientos/prostatectomia-abierta-transvesical/images/image5.png", large: true }
                },
                ejecucion: {
                    anestesia: "Anestesia Raquídea",
                    anestesiaImagen: "",
                    incision: { nombre: "Incisión mediana infraumbilical", tipo: "Incisión mediana infraumbilical", descripcion: "Incisión mediana infraumbilical", imagen: null },
                    pasos: [
                        { paso: 1, tecnica: "Incisión mediana infraumbilical", instrumental: ["Mango de bisturí 4", "Hoja de bisturí 20"] },
                        { paso: 2, tecnica: "Hemostasia", instrumental: ["Pinza Kelly curva", "Lapicero del electrobisturí"] },
                        { paso: 3, tecnica: "Visualización, incisión de la fascia, músculos rectos y divulsión de estos", instrumental: ["Pinza Kelly curva", "Lapicero del electrobisturí"] },
                        { paso: 4, tecnica: "Visualización de la vejiga", instrumental: ["Separador de Judd-Mason", "Valva suprapúbica"] },
                        { paso: 5, tecnica: "Reparos a los lados de la vejiga", instrumental: ["Seda 2/0 o 3/0 aguja ½ círculo redonda"] },
                        { paso: 6, tecnica: "Tracción de la vejiga e incisión", instrumental: ["Pinza Allix", "Mango de bisturí 4 largo", "Hoja de bisturí 15"] },
                        { paso: 7, tecnica: "Aspiración de la vejiga", instrumental: ["Cánula de Yankauer"] },
                        { paso: 8, tecnica: "Visualización del cuello vesical", instrumental: ["Separador de Deaver ancho"] },
                        { paso: 9, tecnica: "Sección y resección de la mucosa prostática y glándula", instrumental: ["Electrobisturí con pala larga"] },
                        { paso: 10, tecnica: "Circuncidados de la próstata y extracción", instrumental: ["Tijeras de Metzenbaum"] },
                        { paso: 11, tecnica: "Sutura del lecho prostático", instrumental: ["Portaagujas largo", "Disección sin garra", "Poliglactina 910 0-2/0 aguja ½ redonda"] },
                        { paso: 12, tecnica: "Colocación de la sonda en el cuello vesical", instrumental: ["Sonda Foley 22x30 tres vías", "Jeringa de 10 cc", "Cystoflo", "Equipo de venoclisis", "Solución salina de 100 cc"] },
                        { paso: 13, tecnica: "Dren por contrabertura", instrumental: ["Cystoflo", "Dren de Jackson-Pratt"] },
                        { paso: 14, tecnica: "Sonda para cistostomía", instrumental: ["Sonda Foley 22x30 tres vías", "Jeringa 10 cc", "Cystoflo"] },
                        { paso: 15, tecnica: "Cierre por planos y curación", instrumental: ["Portaagujas mediano", "Pinza de disección con garra", "Separador de Farabeuf", "Pinza de disección Adson con garra", "Poliglactina 910 2/0 aguja medio circulo redonda", "Polipropileno 3/0 aguja curva cortante"] }
                    ]
                }
            }
        }
    ]
};

const equiposCatalogo = [
    {
        id: 1,
        nombre: "Cistoscopio flexible",
        categoria: "Cistoscopio",
        variante: "Flexible",
        descripcion_corta: "Exploración vesical menos invasiva, con mayor comodidad para el paciente.",
        definicion: "Instrumento delgado, largo y flexible usado para observar el interior de la vejiga y la uretra.",
        caracteristicas: [
            "Tubo flexible que facilita el paso por la uretra.",
            "Cámara y fuente de luz en la punta para visualización en tiempo real.",
            "Canal de trabajo para tomar muestras o introducir accesorios.",
            "Suele emplearse con anestesia local o sedación ligera según el caso."
        ],
        partes: ["Mango o empuñadura", "Tubo flexible", "Sistema óptico/cámara", "Fuente de luz", "Canal de trabajo"],
        usos: ["Cistoscopia diagnóstica", "Toma de biopsias", "Evaluación de hematuria", "Inspección de uretra y vejiga"],
        funcionamiento: "La luz viaja por fibras ópticas hasta la punta, ilumina el campo y la imagen se transmite a una cámara o sistema óptico para observar la vejiga y la uretra en tiempo real.",
        mainImage: "./assets/instrumentos/cistoscopio-flexible/main.jpg",
        partsImage: "./assets/instrumentos/cistoscopio-flexible/partes.png"
    },
    {
        id: 2,
        nombre: "Cistoscopio semirrígido",
        categoria: "Cistoscopio",
        variante: "Semirrígido",
        descripcion_corta: "Mayor precisión y estabilidad para exploraciones y procedimientos transuretrales.",
        definicion: "Instrumento tubular metálico, no totalmente flexible, que permite exploración y tratamiento endoscópico del tracto urinario inferior.",
        caracteristicas: [
            "Estructura rígida o semirrígida con mayor durabilidad.",
            "Ofrece visión estable y directa.",
            "Permite introducir instrumental de trabajo por su canal.",
            "Puede ser más incómodo que el flexible, pero facilita ciertos procedimientos."
        ],
        partes: ["Mango", "Tubo semirrígido", "Óptica", "Sistema de irrigación", "Canal de trabajo"],
        usos: ["Exploración vesical", "Extracción de cuerpos extraños", "Procedimientos endoscópicos del tracto urinario inferior"],
        funcionamiento: "Se introduce por la uretra bajo visión directa; el sistema óptico y la irrigación permiten identificar la cavidad y maniobrar instrumentos por el canal de trabajo.",
        mainImage: "./assets/instrumentos/cistoscopio-semirrigido/main.png",
        partsImage: "./assets/instrumentos/cistoscopio-semirrigido/partes.png"
    },
    {
        id: 3,
        nombre: "Láser Holmium",
        categoria: "Láser Holmium",
        variante: "Equipo láser",
        descripcion_corta: "Láser pulsado de alta precisión para fragmentar cálculos y cortar tejido.",
        definicion: "Láser médico-quirúrgico con longitud de onda cercana a 2.1 micrómetros, altamente absorbida por el agua y los tejidos húmedos.",
        caracteristicas: [
            "Emisión pulsada de alta energía.",
            "Penetración superficial mínima y buen control térmico.",
            "Compatible con fibras ópticas flexibles.",
            "Permite ajustar energía, frecuencia y duración del pulso desde consola."
        ],
        partes: ["Unidad generadora", "Consola de control", "Sistema de enfriamiento", "Fibra óptica", "Pedal de activación"],
        usos: ["Litotricia", "Enucleación prostática", "Vaporización y corte de tejidos", "Procedimientos mínimamente invasivos"],
        funcionamiento: "Un medio activo dopado con holmio recibe energía y genera pulsos láser que, al contacto con el tejido o cálculo, producen fragmentación, vaporización o corte con mínima zona térmica.",
        mainImage: "./assets/instrumentos/laser-holmium/main.png",
        partsImage: "./assets/instrumentos/laser-holmium/partes.png"
    },
    {
        id: 4,
        nombre: "Láser Thulium",
        categoria: "Láser Thulium",
        variante: "Equipo láser",
        descripcion_corta: "Láser de emisión continua útil para corte fino y vaporización controlada.",
        definicion: "Tecnología láser utilizada en urología que emite de forma continua y ofrece un corte más eficaz, con menor identificación de planos quirúrgicos frente al Holmium.",
        caracteristicas: [
            "Emisión continua.",
            "Buena potencia para corte y vaporización.",
            "Longitud de onda alrededor de 1940-2013 nm según el sistema.",
            "Disparo frontal o lateral según el equipo."
        ],
        partes: ["Unidad principal", "Consola de programación", "Fibra óptica", "Sistema de refrigeración", "Pedal"],
        usos: ["Vaporización prostática", "Corte tisular fino", "Tratamiento endoscópico en urología"],
        funcionamiento: "La energía se transmite por una fibra dopada con tulio; el haz continuo interactúa con el tejido produciendo corte, vaporización y coagulación en función de la potencia seleccionada.",
        mainImage: "./assets/instrumentos/laser-thulium/main.jpg",
        partsImage: "./assets/instrumentos/laser-thulium/partes.jpg"
    },
    {
        id: 5,
        nombre: "Litotriptor mecánico",
        categoria: "Litotriptor mecánico",
        variante: "Manual",
        descripcion_corta: "Dispositivo manual para fragmentar cálculos por compresión o corte mecánico.",
        definicion: "Instrumento quirúrgico manual empleado en urología para romper cálculos localizados en vejiga, uréteres o riñones mediante acción mecánica directa.",
        caracteristicas: [
            "No requiere energía eléctrica.",
            "Se usa por canal de trabajo endoscópico.",
            "Construcción resistente y esterilizable.",
            "Diseño compacto y de maniobra precisa."
        ],
        partes: ["Mango o sistema de palanca", "Eje", "Mandíbulas o pinzas distales", "Cesta o mecanismo de fragmentación"],
        usos: ["Fragmentación de cálculos vesicales", "Tratamiento endoscópico de litos ureterales", "Extracción de fragmentos"],
        funcionamiento: "El cirujano introduce el instrumento hasta el cálculo y acciona el mecanismo distal; las mandíbulas lo sujetan y aplican fuerza mecánica para fragmentarlo.",
        mainImage: "./assets/instrumentos/litotriptor-mecanico/main.png",
        partsImage: "./assets/instrumentos/litotriptor-mecanico/partes.png"
    },
    {
        id: 6,
        nombre: "Morcelador de próstata",
        categoria: "Morcelador de próstata",
        variante: "Transuretral",
        descripcion_corta: "Tritura y aspira tejido prostático tras la enucleación.",
        definicion: "Dispositivo usado en cirugía mínimamente invasiva para retirar tejido prostático fibroso o hiperplásico después de la enucleación.",
        caracteristicas: [
            "Se introduce por vía transuretral mediante endoscopio.",
            "Integra aspiración para retirar fragmentos.",
            "Utiliza cuchillas internas protegidas.",
            "Reduce la necesidad de cirugía abierta."
        ],
        partes: ["Mango", "Cuerpo del instrumento", "Sistema de aspiración", "Cuchillas internas", "Vaina de trabajo"],
        usos: ["Cirugía prostática mínimamente invasiva", "Extracción de tejido tras HoLEP", "Evacuación de fragmentos prostáticos"],
        funcionamiento: "Tras la enucleación, se introduce por el endoscopio; las cuchillas giratorias o el sistema de presión trituran el tejido y la aspiración lo extrae bajo visión directa.",
        mainImage: "./assets/instrumentos/morcelador-prostata/main.png",
        partsImage: "./assets/instrumentos/morcelador-prostata/partes.png"
    },
    {
        id: 7,
        nombre: "Nefroscopio",
        categoria: "Nefroscopio",
        variante: "Percutáneo",
        descripcion_corta: "Permite visualizar y tratar el interior del riñón por vía percutánea.",
        definicion: "Instrumento médico empleado en nefroscopias para la visualización directa del interior renal, introducido generalmente por acceso percutáneo.",
        caracteristicas: [
            "Diseñado para procedimientos mínimamente invasivos.",
            "Existe en versiones estándar, mini y de gran flujo.",
            "Ofrece buen acceso al sistema colector renal.",
            "Compatible con litotricia y extracción de fragmentos."
        ],
        partes: ["Óptica", "Tubo o vaina", "Canal de trabajo", "Sistema de irrigación", "Conexión de luz"],
        usos: ["Nefrolitotomía percutánea", "Extracción de cálculos renales", "Inspección del sistema colector renal"],
        funcionamiento: "Se accede al riñón por vía percutánea guiada por imagen; el tracto se dilata y se introduce el nefroscopio para visualizar, fragmentar y extraer cálculos por su canal de trabajo.",
        mainImage: "./assets/instrumentos/nefroscopio/main.jpg",
        partsImage: "./assets/instrumentos/nefroscopio/partes.png"
    },
    {
        id: 8,
        nombre: "Resectoscopio",
        categoria: "Resectoscopio",
        variante: "Endoscópico",
        descripcion_corta: "Instrumento para resecar o coagular tejido con irrigación y visión directa.",
        definicion: "Instrumento quirúrgico delgado en forma de tubo que se introduce en el cuerpo para extraer o destruir tejido y controlar sangrado.",
        caracteristicas: [
            "Óptica integrada para visualización en tiempo real.",
            "Canal de trabajo para asas y electrodos.",
            "Sistema de irrigación para distender y limpiar la cavidad.",
            "Compatible con corriente eléctrica para corte y coagulación."
        ],
        partes: ["Óptica", "Mango", "Vaina", "Asa de resección", "Sistema de irrigación"],
        usos: ["Resección transuretral", "Coagulación de tejido", "Tratamiento de hiperplasia prostática benigna y otras lesiones"],
        funcionamiento: "Se introduce por la uretra con irrigación continua; a través del canal de trabajo se insertan electrodos o asas que cortan o coagulan el tejido bajo visión directa.",
        mainImage: "./assets/instrumentos/resectoscopio/main.png",
        partsImage: "./assets/instrumentos/resectoscopio/partes.png"
    },
    {
        id: 9,
        nombre: "Ureteroscopio flexible",
        categoria: "Ureteroscopio",
        variante: "Flexible",
        descripcion_corta: "Acceso a uréter y pelvis renal con máxima maniobrabilidad.",
        definicion: "Instrumento delgado en forma de tubo con luz y lente para observar desde la uretra hasta el uréter y la pelvis renal.",
        caracteristicas: [
            "Alta flexibilidad para áreas de difícil acceso.",
            "Diámetro reducido para menor trauma.",
            "Canal de trabajo para pinzas, láser o sondas.",
            "Mejor maniobrabilidad en el uréter superior y la pelvis renal."
        ],
        partes: ["Mango", "Vaina flexible", "Sistema óptico/cámara", "Canal de trabajo", "Fuente de luz"],
        usos: ["Ureteroscopia diagnóstica", "Litotricia endoscópica", "Extracción de cálculos ureterales", "Exploración de pelvis renal"],
        funcionamiento: "Se introduce por la uretra hasta la vejiga y luego al uréter; la imagen se transmite por fibras ópticas o cámara digital mientras el canal de trabajo permite maniobrar instrumentos.",
        mainImage: "./assets/instrumentos/ureteroscopio-flexible/main.jpg",
        partsImage: "./assets/instrumentos/ureteroscopio-flexible/partes.png"
    },
    {
        id: 10,
        nombre: "Ureteroscopio rígido",
        categoria: "Ureteroscopio",
        variante: "Rígido",
        descripcion_corta: "Visión directa y estable para procedimientos ureterales seleccionados.",
        definicion: "Instrumento rígido y alargado que permite explorar el interior del tracto urinario, especialmente los uréteres.",
        caracteristicas: [
            "Visión directa y estable.",
            "Estructura más firme que el flexible.",
            "Suele ser útil en ureteroscopia distal.",
            "Disponible en diferentes calibres según el paciente."
        ],
        partes: ["Mango", "Tubo rígido", "Sistema óptico", "Canal de trabajo", "Conector de luz"],
        usos: ["Exploración ureteral", "Extracción de cálculos", "Procedimientos endoscópicos sobre uréter distal"],
        funcionamiento: "Se introduce bajo visión endoscópica para explorar el uréter; su rigidez aporta estabilidad y permite actuar con precisión sobre cálculos o lesiones.",
        mainImage: "./assets/instrumentos/ureteroscopio-rigido/main.jpg",
        partsImage: "./assets/instrumentos/ureteroscopio-rigido/partes.png"
    },
    {
        id: 11,
        nombre: "Uretrotomo",
        categoria: "Uretrotomo",
        variante: "Endoscópico",
        descripcion_corta: "Sirve para cortar estenosis uretrales con precisión controlada.",
        definicion: "Instrumento quirúrgico utilizado en procedimientos de uretrotomía para realizar cortes controlados dentro de la uretra.",
        caracteristicas: [
            "Diseñado para áreas estrechas de la uretra.",
            "Precisión en el corte de tejido fibroso.",
            "Fabricado en acero inoxidable quirúrgico.",
            "Puede ser compatible con sistemas endoscópicos."
        ],
        partes: ["Mango", "Cuerpo del instrumento", "Cuchilla o sistema de corte", "Sistema óptico o guía", "Mecanismo de avance"],
        usos: ["Uretrotomía interna", "Tratamiento de estenosis uretral", "Apertura de conductos uretrales estrechos"],
        funcionamiento: "Bajo visión endoscópica, el instrumento se sitúa en la zona de estenosis; la cuchilla se desliza y corta el tejido fibroso para restablecer el calibre uretral.",
        mainImage: "./assets/instrumentos/uretrotomo/main.jpg",
        partsImage: "./assets/instrumentos/uretrotomo/partes.png"
    }
];

const fallbackEquipos = equiposCatalogo;

    function toggleDarkMode() {
    darkMode = !darkMode;
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    return darkMode;
    }

    async function loadEquipos() {
    try {
        const response = await fetch("./data/equipos.json");
        if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
        }
        const equipos = await response.json();
        equiposOriginal = Array.isArray(equipos) ? equipos : [];
        equiposState = [...equiposOriginal];
        return equiposState;
    } catch (error) {
        equiposOriginal = [...fallbackEquipos];
        equiposState = [...fallbackEquipos];
        return equiposState;
    }
    }

    function renderEquipos(equipos) {
    const grid = document.querySelector(".equipos-grid");
    if (!grid) {
        return;
    }

    const emptyState = document.querySelector(".empty-state");
    if (!equipos || equipos.length === 0) {
        grid.innerHTML = "";
        if (emptyState) {
        emptyState.hidden = false;
        }
        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
    }

    grid.innerHTML = equipos
        .map((equipo) => {
        const categoriaClass = `categoria-${normalizeText(equipo.categoria)}`;
        const varianteEtiqueta = equipo.variante ? `<p class="equipo-variant">${escapeHtml(equipo.variante)}</p>` : "";
        return `
            <article class="card equipo-card fade-in ${categoriaClass}" data-id="${equipo.id}">
            <div class="equipo-strip" aria-hidden="true"></div>
            ${equipo.mainImage ? `<div class="card-image-wrapper"><img class="card-image" src="${escapeHtml(equipo.mainImage)}" alt="${escapeHtml((equipo.nombre || "Instrumento") + " - imagen principal")}" loading="lazy" decoding="async" width="800" height="600"></div>` : ""}
            <div class="equipo-body">
                <span class="badge">${escapeHtml(equipo.categoria)}</span>
                <h3>${escapeHtml(equipo.nombre)}</h3>
                ${varianteEtiqueta}
                <p>${escapeHtml(equipo.descripcion_corta)}</p>
                <button class="btn btn-secondary equipo-more" type="button" data-equipo-id="${equipo.id}">Ver más</button>
            </div>
            </article>
        `;
        })
        .join("");

    const buttons = grid.querySelectorAll(".equipo-more");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
        const equipoId = Number(button.dataset.equipoId);
        const equipo = equipos.find((item) => item.id === equipoId);
        if (equipo) {
            openModal(equipo);
        }
        });
    });

    observeFadeIns();
    }

    function filterEquipos(categoria) {
    const searchInput = document.querySelector(".search-bar input");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const filtered = equiposOriginal.filter((equipo) => {
        const matchCategoria = categoria === "Todos" || equipo.categoria === categoria;
        const searchableText = `${equipo.nombre} ${equipo.variante || ""} ${equipo.categoria}`.toLowerCase();
        const matchQuery = !query || searchableText.includes(query);
        return matchCategoria && matchQuery;
    });

    equiposState = filtered;
    renderEquipos(filtered);
    }

    function openModal(equipo) {
    const modal = document.querySelector(".modal");
    if (!modal) {
        return;
    }

    const title = modal.querySelector(".modal-title");
    const badge = modal.querySelector(".modal-badge");
    const definition = modal.querySelector(".modal-definition");
    const characteristics = modal.querySelector(".modal-characteristics");
    const parts = modal.querySelector(".modal-parts");
    const uses = modal.querySelector(".modal-uses");
    const functioning = modal.querySelector(".modal-functioning");
    const imagePlaceholder = modal.querySelector(".modal-image");

    if (title) {
        title.textContent = equipo.nombre;
    }
    if (badge) {
        badge.textContent = equipo.categoria;
    }
    if (definition) {
        definition.textContent = equipo.definicion || equipo.descripcion_larga || "";
    }
    if (characteristics) {
        characteristics.innerHTML = Array.isArray(equipo.caracteristicas)
        ? equipo.caracteristicas.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
        : "";
    }
    if (parts) {
        const partsListHtml = Array.isArray(equipo.partes) ? equipo.partes.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "";
        if (equipo.partsImage) {
        const partsImgHtml = `
            <li class="parts-image-item">
                <p class="modal-parts-caption">Partes del instrumento</p>
                <img class="modal-parts-image" src="${escapeHtml(equipo.partsImage)}" alt="${escapeHtml((equipo.nombre || "Instrumento") + " - esquema de partes")}" loading="lazy" decoding="async" width="1200" height="900">
                <button class="btn btn-secondary modal-parts-expand" type="button" data-open-parts-image data-parts-image-src="${escapeHtml(equipo.partsImage)}" data-parts-image-alt="${escapeHtml((equipo.nombre || "Instrumento") + " - esquema de partes")}" aria-label="Ampliar imagen de partes de ${escapeHtml(equipo.nombre || "instrumento")}">Ampliar imagen de partes</button>
            </li>
        `;
        parts.innerHTML = partsImgHtml + partsListHtml;
        } else {
        parts.innerHTML = partsListHtml;
        }
    }
    if (uses) {
        uses.innerHTML = Array.isArray(equipo.usos)
        ? equipo.usos.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
        : "";
    }
    if (functioning) {
        functioning.textContent = equipo.funcionamiento || equipo.uso || "";
    }
    if (imagePlaceholder) {
        imagePlaceholder.setAttribute("alt", `${equipo.nombre || "Instrumento"} - imagen principal`);
        if (equipo.mainImage) {
        imagePlaceholder.src = equipo.mainImage;
        imagePlaceholder.loading = "lazy";
        imagePlaceholder.decoding = "async";
        } else {
        imagePlaceholder.removeAttribute('src');
        }
    }

    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
    modalContent.classList.remove("modal-planeamiento");
    modalContent.classList.add("modal-equipo");
    }

    resetModalScrollPosition(modal);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    currentModal = modal;
    syncBodyScrollLock();
}

    function closeModal() {
    const modal = document.querySelector(".modal");
    if (!modal) {
        return;
    }

    resetModalScrollPosition(modal);
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    currentModal = null;
    syncBodyScrollLock();
    }

    function resetModalScrollPosition(modal) {
    if (!modal) {
        return;
    }

    const modalContent = modal.querySelector(".modal-content");
    const modalArticle = modal.querySelector(".modal-article");
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
    if (modalArticle) {
        modalArticle.scrollTop = 0;
    }
    }

    function syncBodyScrollLock() {
    const modalOpen = !!document.querySelector(".modal.is-open");
    const imageViewerOpen = !!document.querySelector(".image-viewer-modal.is-open");
    document.body.classList.toggle("modal-open", modalOpen || imageViewerOpen);
    }

    function ensureImageViewerModal() {
    let viewer = document.querySelector(".image-viewer-modal");
    if (viewer) {
        return viewer;
    }

    viewer = document.createElement("div");
    viewer.className = "image-viewer-modal";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-hidden", "true");
    viewer.innerHTML = `
        <div class="image-viewer-overlay" data-close-image-viewer></div>
        <div class="image-viewer-content">
            <button class="image-viewer-close" type="button" data-close-image-viewer aria-label="Cerrar visor de imagen">×</button>
            <div class="image-viewer-zoom-controls" aria-label="Controles de zoom de imagen">
                <button class="image-viewer-zoom-btn" type="button" data-image-zoom-out aria-label="Reducir zoom">−</button>
                <button class="image-viewer-zoom-btn" type="button" data-image-zoom-reset aria-label="Restablecer zoom">100%</button>
                <button class="image-viewer-zoom-btn" type="button" data-image-zoom-in aria-label="Aumentar zoom">+</button>
            </div>
            <div class="image-viewer-stage">
                <img class="image-viewer-image" src="" alt="">
            </div>
        </div>
    `;

    document.body.appendChild(viewer);
    return viewer;
    }

    function openImageViewer(imageSrc, imageAlt) {
    if (!imageSrc) {
        return;
    }

    const viewer = ensureImageViewerModal();
    const image = viewer.querySelector(".image-viewer-image");
    const closeButton = viewer.querySelector(".image-viewer-close");
    if (!image || !closeButton) {
        return;
    }

    image.src = imageSrc;
    image.alt = imageAlt || "Imagen ampliada de partes";
    image.loading = "eager";
    image.decoding = "async";
    image.onload = () => {
        syncImageViewerBaseOffsets();
        setImageViewerScale(1, 0, 0);
    };

    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    currentImageViewer = viewer;
    syncBodyScrollLock();
    window.requestAnimationFrame(() => {
        syncImageViewerBaseOffsets();
        setImageViewerScale(1, 0, 0);
    });
    closeButton.focus();
    }

    function closeImageViewer() {
    const viewer = document.querySelector(".image-viewer-modal");
    if (!viewer) {
        return;
    }

    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    currentImageViewer = null;
    isImageViewerPanning = false;
    imageViewerPanPointerId = null;
    setImageViewerScale(1, 0, 0);
    syncBodyScrollLock();
    }

    function setImageViewerScale(nextScale, nextOffsetX = currentImageViewerOffsetX, nextOffsetY = currentImageViewerOffsetY) {
    const viewer = document.querySelector(".image-viewer-modal");
    if (!viewer) {
        return;
    }

    const image = viewer.querySelector(".image-viewer-image");
    const stage = viewer.querySelector(".image-viewer-stage");
    const resetButton = viewer.querySelector("[data-image-zoom-reset]");
    if (!image || !stage) {
        return;
    }

    const clampedScale = Math.min(IMAGE_VIEWER_MAX_SCALE, Math.max(IMAGE_VIEWER_MIN_SCALE, nextScale));
    currentImageViewerScale = clampedScale;
    if (clampedScale <= IMAGE_VIEWER_MIN_SCALE) {
        currentImageViewerOffsetX = 0;
        currentImageViewerOffsetY = 0;
    } else {
        currentImageViewerOffsetX = nextOffsetX;
        currentImageViewerOffsetY = nextOffsetY;
    }

    image.style.transform = `translate3d(${currentImageViewerOffsetX}px, ${currentImageViewerOffsetY}px, 0) scale(${clampedScale})`;
    image.style.transformOrigin = "0 0";
    stage.classList.toggle("is-pannable", clampedScale > IMAGE_VIEWER_MIN_SCALE);

    if (resetButton) {
        resetButton.textContent = `${Math.round(clampedScale * 100)}%`;
    }
    }

    function syncImageViewerBaseOffsets() {
    const viewer = document.querySelector(".image-viewer-modal");
    if (!viewer) {
        return;
    }

    const image = viewer.querySelector(".image-viewer-image");
    const stage = viewer.querySelector(".image-viewer-stage");
    if (!image || !stage) {
        return;
    }

    const stageRect = stage.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    imageViewerBaseOffsetX = imageRect.left - stageRect.left;
    imageViewerBaseOffsetY = imageRect.top - stageRect.top;
    }

    function setImageViewerScaleAtPoint(nextScale, clientX, clientY) {
    const viewer = document.querySelector(".image-viewer-modal");
    if (!viewer) {
        return;
    }

    const stage = viewer.querySelector(".image-viewer-stage");
    if (!stage) {
        return;
    }

    const clampedScale = Math.min(IMAGE_VIEWER_MAX_SCALE, Math.max(IMAGE_VIEWER_MIN_SCALE, nextScale));
    const previousScale = currentImageViewerScale;
    if (clampedScale === previousScale) {
        return;
    }

    const stageRect = stage.getBoundingClientRect();
    const pointX = clientX - stageRect.left;
    const pointY = clientY - stageRect.top;
    const localX = (pointX - imageViewerBaseOffsetX - currentImageViewerOffsetX) / previousScale;
    const localY = (pointY - imageViewerBaseOffsetY - currentImageViewerOffsetY) / previousScale;
    const nextOffsetX = pointX - imageViewerBaseOffsetX - (localX * clampedScale);
    const nextOffsetY = pointY - imageViewerBaseOffsetY - (localY * clampedScale);

    setImageViewerScale(clampedScale, nextOffsetX, nextOffsetY);
    }

    function zoomImageViewerIn() {
    const viewer = document.querySelector(".image-viewer-modal");
    const stage = viewer ? viewer.querySelector(".image-viewer-stage") : null;
    if (!stage) {
        setImageViewerScale(currentImageViewerScale + IMAGE_VIEWER_SCALE_STEP);
        return;
    }

    const rect = stage.getBoundingClientRect();
    setImageViewerScaleAtPoint(currentImageViewerScale + IMAGE_VIEWER_SCALE_STEP, rect.left + (rect.width / 2), rect.top + (rect.height / 2));
    }

    function zoomImageViewerOut() {
    const viewer = document.querySelector(".image-viewer-modal");
    const stage = viewer ? viewer.querySelector(".image-viewer-stage") : null;
    if (!stage) {
        setImageViewerScale(currentImageViewerScale - IMAGE_VIEWER_SCALE_STEP);
        return;
    }

    const rect = stage.getBoundingClientRect();
    setImageViewerScaleAtPoint(currentImageViewerScale - IMAGE_VIEWER_SCALE_STEP, rect.left + (rect.width / 2), rect.top + (rect.height / 2));
    }

    function resetImageViewerZoom() {
    syncImageViewerBaseOffsets();
    setImageViewerScale(1, 0, 0);
    }

    function initAccordion() {
    const items = document.querySelectorAll(".accordion-item");
    items.forEach((item) => {
        const button = item.querySelector(".accordion-header");
        const content = item.querySelector(".accordion-content");
        if (!button || !content) {
        return;
        }

        const syncState = (expanded) => {
        button.setAttribute("aria-expanded", String(expanded));
        content.classList.toggle("is-open", expanded);
        content.hidden = false;
        content.style.maxHeight = expanded ? `${content.scrollHeight}px` : "0px";
        if (!expanded) {
            window.setTimeout(() => {
            if (!button.matches('[aria-expanded="true"]')) {
                content.hidden = true;
            }
            }, 350);
        }
        };

        button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        syncState(!expanded);
        });

        content.hidden = true;
        content.style.maxHeight = "0px";
    });
    }

    function initFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    if (!filterButtons.length) {
        return;
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
        // generic filters used on equipos page expect data-category
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const category = button.dataset.category || button.dataset.organ || "Todos";
        filterEquipos(category);
        });
    });
    }

    // Planeamientos page: show/hide organ cards and open modal with planeamientos list
    function initPlaneamientosPage() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const organCards = document.querySelectorAll(".organ-card");
    if (!filterButtons.length || !organCards.length) {
        return;
    }

    const showForOrgan = (organ) => {
        organCards.forEach((card) => {
        const cardOrgan = card.dataset.organ || "";
        // show all when organ is falsy or explicitly 'Todos'
        if (!organ || (typeof organ === 'string' && organ.toLowerCase() === 'todos')) {
            card.style.display = 'block';
        } else {
            card.style.display = cardOrgan === organ ? 'block' : 'none';
        }
        });
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const organ = btn.dataset.organ;
        showForOrgan(organ);
        });
    });

    // Initialize to first active or first button
    const active = document.querySelector('.filter-btn.active') || filterButtons[0];
    if (active) {
        active.classList.add('active');
        showForOrgan(active.dataset.organ || "");
    }

    // Open planeamientos modal (supports optional planeamiento id on the card)
    document.querySelectorAll('.organ-card .btn-secondary').forEach((btn) => {
        btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.organ-card');
        if (!card) return;
        const organ = card.dataset.organ;
        const planeamientoId = card.dataset.planeamientoId ? Number(card.dataset.planeamientoId) : undefined;
        openPlaneamientosModal(organ, planeamientoId);
        });
    });
    }

    function openPlaneamientosModal(organ, planeamientoId) {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    const title = modal.querySelector('.modal-title');
    const badge = modal.querySelector('.modal-badge');
    const longDescription = modal.querySelector('.modal-description');

    const items = planeamientosData[organ] || [];
    const complejoPlaneamiento = items.find(p => p.tipo === 'planeamiento-complejo');
    const planesSimples = items.filter(p => p.tipo !== 'planeamiento-complejo');
    let specificPlaneamiento = null;
    if (planeamientoId) {
        specificPlaneamiento = items.find(p => Number(p.id) === Number(planeamientoId));
    }
    
    if (title) title.textContent = organ;
    if (badge) badge.textContent = 'Planeamientos';
    
    if (longDescription) {
        if (!items.length) {
            longDescription.innerHTML = '<p class="muted">No hay planeamientos disponibles aún.</p>';
        } else {
            // If a specific planeamiento id was requested and found, render only it
            if (specificPlaneamiento) {
                if (specificPlaneamiento.tipo === 'planeamiento-complejo') {
                    longDescription.innerHTML = renderPlaneamientoComplejo(specificPlaneamiento);
                    bindPlaneamientoTabs();
                } else {
                    longDescription.innerHTML = `<article class="planeamiento-item"><h4>${escapeHtml(specificPlaneamiento.titulo)}</h4><p class="muted">${escapeHtml(specificPlaneamiento.resumen || '')}</p></article>`;
                }
            } else {
                let html = '';
                // Si hay un planeamiento complejo, renderizarlo primero
                if (complejoPlaneamiento) {
                    html += renderPlaneamientoComplejo(complejoPlaneamiento);
                }
                // Luego renderizar los planeamientos simples
                if (planesSimples.length) {
                    if (html) html += '<hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--gris-claro);">';
                    html += planesSimples
                        .map((p) => `<article class="planeamiento-item"><h4>${escapeHtml(p.titulo)}</h4><p class="muted">${escapeHtml(p.resumen)}</p></article>`)
                        .join('');
                }
                longDescription.innerHTML = html;
            }
        }
    }
    
    resetModalScrollPosition(modal);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    currentModal = modal;
    syncBodyScrollLock();
    
    // Bind tab events if complex planeamiento exists
    if (complejoPlaneamiento) {
        bindPlaneamientoTabs();
    }
    }

    function renderPlaneamientoComplejo(planeamiento) {
    const { titulo, etapas } = planeamiento;
    
    return `
        <div class="planeamiento-complejo">
            <h3 style="margin-bottom: 1.5rem;">${escapeHtml(titulo)}</h3>
            
            <div class="etapas-tabs" role="tablist" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--gris-claro);">
                <button class="etapa-tab active" role="tab" aria-selected="true" data-etapa="planeacion" style="padding: 0.75rem 1.5rem; background: none; border: none; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent; margin-bottom: -2px;">
                    Planeación
                </button>
                <button class="etapa-tab" role="tab" aria-selected="false" data-etapa="organizacion" style="padding: 0.75rem 1.5rem; background: none; border: none; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent; margin-bottom: -2px;">
                    Organización
                </button>
                <button class="etapa-tab" role="tab" aria-selected="false" data-etapa="ejecucion" style="padding: 0.75rem 1.5rem; background: none; border: none; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent; margin-bottom: -2px;">
                    Ejecución
                </button>
            </div>
            
            <div class="etapa-content">
                ${renderEtapaPlaneacion(etapas.planeacion)}
                ${renderEtapaOrganizacion(etapas.organizacion)}
                ${renderEtapaEjecucion(etapas.ejecucion)}
            </div>
        </div>
    `;
    }

    function renderPlaneamientoImageGallery(images, altPrefix, useLargeClass = false) {
    if (!Array.isArray(images) || images.length === 0) {
        return '';
    }

    const className = useLargeClass ? 'planeamiento-imagen-large' : 'planeamiento-imagen';
    const columns = images.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))';
    return `
        <div style="display:grid; grid-template-columns:${columns}; gap:0.75rem; margin-top:0.75rem;">
            ${images.map((imageSrc, index) => `<img src="${imageSrc}" alt="${altPrefix} ${index + 1}" style="width:100%; height:auto; border-radius:6px; object-fit:contain;" class="${className}" loading="eager">`).join('')}
        </div>
    `;
    }

    function renderPlaneamientoAnatomiaSeccion(seccion) {
    return `
        <section style="margin-bottom: 2rem;">
            <h5 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(seccion.titulo)}</h5>
            ${seccion.imagenArriba ? `<img src="${seccion.imagenArriba}" alt="${escapeHtml(seccion.titulo)}" style="max-width: 100%; height: auto; margin-bottom: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${seccion.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">` : ''}
            ${seccion.contenido ? `<p style="white-space: pre-line;">${escapeHtml(seccion.contenido)}</p>` : ''}
            ${seccion.imagen ? `<img src="${seccion.imagen}" alt="${escapeHtml(seccion.titulo)}" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${seccion.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">` : ''}
            ${renderPlaneamientoImageGallery(seccion.imagenes || [], seccion.altPrefix || escapeHtml(seccion.titulo), seccion.largeGallery || false)}
        </section>
    `;
    }

    function renderEtapaPlaneacion(planeacion) {
    const anatomiaConSecciones = Array.isArray(planeacion.anatomia?.secciones) && planeacion.anatomia.secciones.length;
    return `
        <div class="etapa-panel" data-etapa="planeacion" style="display: block;">
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">Objetivo Quirúrgico</h4>
                <p>${escapeHtml(planeacion.objetivo)}</p>
            </section>
            
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.anatomia.titulo)}</h4>
                ${planeacion.anatomia.imagenArriba ? `<img src="${planeacion.anatomia.imagenArriba}" alt="Anatomía" style="max-width: 100%; height: auto; margin-bottom: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                ${planeacion.anatomia.contenido ? `<p style="white-space: pre-line;">${escapeHtml(planeacion.anatomia.contenido)}</p>` : ''}
                ${anatomiaConSecciones ? planeacion.anatomia.secciones.map(renderPlaneamientoAnatomiaSeccion).join('') : `
                    ${planeacion.anatomia.imagen ? `<img src="${planeacion.anatomia.imagen}" alt="Anatomía" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                    ${renderPlaneamientoImageGallery(planeacion.anatomia.imagenes, "Imagen anatómica")}
                `}

                ${Array.isArray(planeacion.anatomia?.genitalesExternos) && planeacion.anatomia.genitalesExternos.length ? `
                    <div style="margin-top:1rem;">
                        <h5 style="margin-bottom:0.5rem; color: #333;">Genitales Externos</h5>
                        <ul style="margin-left:1.5rem;">
                            ${planeacion.anatomia.genitalesExternos.map(g => `<li>${escapeHtml(g)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${Array.isArray(planeacion.anatomia?.genitalesInternos) && planeacion.anatomia.genitalesInternos.length ? `
                    <div style="margin-top:1rem;">
                        <h5 style="margin-bottom:0.5rem; color: #333;">Genitales Internos</h5>
                        <ul style="margin-left:1.5rem;">
                            ${planeacion.anatomia.genitalesInternos.map(g => `<li>${escapeHtml(g)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${planeacion.anatomia.imagenDebajo ? `<img src="${planeacion.anatomia.imagenDebajo}" alt="Imagen anatómica inferior" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
            </section>
            
            ${planeacion.partes ? `
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.partes.titulo)}</h4>
                <ul style="margin-left: 1.5rem;">
                    ${Array.isArray(planeacion.partes?.items) ? planeacion.partes.items.map(item => `
                            <li style="margin-bottom: 0.5rem;">
                                <strong>${escapeHtml(item.nombre)}:</strong> ${escapeHtml(item.descripcion)}
                                ${item.imagen ? `<br><img src="${item.imagen}" alt="${escapeHtml(item.nombre)}" style="max-width: 100%; height: auto; margin-top: 0.5rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                        </li>
                    `).join('') : ''}
                </ul>
                ${renderPlaneamientoImageGallery(planeacion.partes.imagenes || [], "Imagen de partes")}
            </section>
            ` : ''}
            
            ${planeacion.irrigacion ? `
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.irrigacion.titulo)}</h4>
                <p style="white-space: pre-line;">${escapeHtml(planeacion.irrigacion.contenido)}</p>
                ${Array.isArray(planeacion.irrigacion.arterias) && planeacion.irrigacion.arterias.length ? `
                    <div style="margin-top:0.5rem;"><strong>Arterias principales:</strong>
                        <ul style="margin-left:1.5rem;">${planeacion.irrigacion.arterias.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                ${Array.isArray(planeacion.irrigacion.venas) && planeacion.irrigacion.venas.length ? `
                    <div style="margin-top:0.5rem;"><strong>Venas que drenan:</strong>
                        <ul style="margin-left:1.5rem;">${planeacion.irrigacion.venas.map(v => `<li>${escapeHtml(v)}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                ${planeacion.irrigacion.imagen ? `<img src="${planeacion.irrigacion.imagen}" alt="Irrigación e inervación" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                ${planeacion.irrigacion.imagenInervacion ? `<img src="${planeacion.irrigacion.imagenInervacion}" alt="Inervación" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                ${renderPlaneamientoImageGallery(planeacion.irrigacion.imagenes || [], "Imagen de irrigación")}
                ${planeacion.irrigacion.imagenDebajo ? `<img src="${planeacion.irrigacion.imagenDebajo}" alt="Imagen de vascularización inferior" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
            </section>
            ` : ''}

            ${planeacion.inervacion ? `
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.inervacion.titulo || 'Inervación')}</h4>
                ${planeacion.inervacion.contenido ? `<p style="white-space: pre-line;">${escapeHtml(planeacion.inervacion.contenido)}</p>` : ''}
            </section>
            ` : ''}
            
            ${planeacion.fisiologia ? `
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.fisiologia.titulo)}</h4>
                ${planeacion.fisiologia.contenido ? `<p style="white-space: pre-line;">${escapeHtml(planeacion.fisiologia.contenido)}</p>` : ''}
                ${Array.isArray(planeacion.fisiologia?.funciones) && planeacion.fisiologia.funciones.length ? `
                    <ul style="margin-left: 1.5rem;">
                        ${planeacion.fisiologia.funciones.map(func => `
                            <li style="margin-bottom: 0.75rem;"><strong>${escapeHtml(func.nombre)}:</strong> ${escapeHtml(func.descripcion)}</li>
                        `).join('')}
                    </ul>
                ` : ''}
                ${renderPlaneamientoImageGallery(planeacion.fisiologia.imagenes || [], "Imagen de fisiología")}
            </section>
            ` : ''}
            
            ${planeacion.checklist ? `
            <section>
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(planeacion.checklist.titulo)}</h4>
                <div class="planeamiento-checklist-wrapper" style="margin-top:0.5rem;">
                    <table class="planeamiento-checklist-table" style="width:100%; border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th>Instrumental</th>
                                <th>Equipos / Dispositivos médico</th>
                                <th>Suturas y Agujas</th>
                                <th>Fármacos y Soluciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <ul>
                                        ${Array.isArray(planeacion.checklist?.categorias?.instrumental) ? planeacion.checklist.categorias.instrumental.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        ${Array.isArray(planeacion.checklist?.categorias?.equipos) ? planeacion.checklist.categorias.equipos.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        ${Array.isArray(planeacion.checklist?.categorias?.suturas) ? planeacion.checklist.categorias.suturas.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        ${Array.isArray(planeacion.checklist?.categorias?.farmacos) ? planeacion.checklist.categorias.farmacos.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            ` : ''}
        </div>
    `;
    }

    function renderEtapaOrganizacion(organizacion) {
    const mesaMayo = organizacion?.mesaMayo;
    const mesaReserva = organizacion?.mesaReserva;
    const posicionPaciente = organizacion?.posicionPaciente;
    const equipoQuirurgico = organizacion?.equipoQuirurgico;

    return `
        <div class="etapa-panel" data-etapa="organizacion" style="display: none;">
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(mesaMayo?.titulo || "Mesa de Mayo")}</h4>
                ${mesaMayo ? `
                    <ul style="margin-left: 1.5rem; columns: 2; column-gap: 2rem;">
                        ${Array.isArray(mesaMayo?.items) ? mesaMayo.items.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                    </ul>
                    ${mesaMayo.imagen ? `
                        <div style="margin-top:1rem;">
                            <img src="${mesaMayo.imagen}" alt="Mesa de Mayo" style="max-width: 100%; height: auto; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${mesaMayo.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">
                            <button class="btn btn-secondary modal-parts-expand" type="button" data-open-parts-image data-parts-image-src="${escapeHtml(mesaMayo.imagen)}" data-parts-image-alt="${escapeHtml(mesaMayo.titulo || 'Mesa de Mayo')}" aria-label="Ampliar imagen de Mesa de Mayo">Ampliar imagen</button>
                        </div>
                    ` : ''}
                ` : `<p>No se lleva mesa de mayo, sino una de reserva.</p>`}
            </section>
            
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(mesaReserva?.titulo || "Mesa de Reserva")}</h4>
                ${mesaReserva?.descripcion ? `<p>${escapeHtml(mesaReserva.descripcion)}</p>` : ''}
                <ul style="margin-left: 1.5rem; columns: 2; column-gap: 2rem;">
                    ${Array.isArray(mesaReserva?.items) ? mesaReserva.items.map(item => `<li>${escapeHtml(item)}</li>`).join('') : ''}
                </ul>
                ${mesaReserva?.imagen ? `
                    <div style="margin-top:1rem;">
                        <img src="${mesaReserva.imagen}" alt="Mesa de Reserva" style="max-width: 100%; height: auto; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${mesaReserva.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">
                        <button class="btn btn-secondary modal-parts-expand" type="button" data-open-parts-image data-parts-image-src="${escapeHtml(mesaReserva.imagen)}" data-parts-image-alt="${escapeHtml(mesaReserva.titulo || 'Mesa de Reserva')}" aria-label="Ampliar imagen de Mesa de Reserva">Ampliar imagen</button>
                    </div>
                ` : ''}
            </section>
            
            <section style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(posicionPaciente?.titulo || "Posición del paciente")}</h4>
                <p><strong>Posición:</strong> ${escapeHtml(posicionPaciente?.nombre || "No definida")}</p>
                <p>${escapeHtml(posicionPaciente?.descripcion || "")}</p>
                ${posicionPaciente?.imagen ? `<img src="${posicionPaciente.imagen}" alt="Posición del paciente" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${posicionPaciente.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">` : ''}

                ${Array.isArray(posicionPaciente?.posiciones) && posicionPaciente.posiciones.length ? `
                    <div style="display:flex; gap:1rem; margin-top:1rem; flex-wrap:wrap;">
                        ${posicionPaciente.posiciones.map(pos => `
                            <figure style="margin:0; width: calc(50% - 0.5rem);">
                                <img src="${pos.imagen}" alt="${escapeHtml(pos.nombre)}" style="width:100%; height:auto; border-radius:0.5rem; object-fit:contain; cursor: pointer;" class="${posicionPaciente.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">
                                <figcaption style="font-size:0.9rem; margin-top:0.5rem; text-align:center; color:#444;">${escapeHtml(pos.nombre)}</figcaption>
                            </figure>
                        `).join('')}
                    </div>
                ` : ''}
            </section>
            
            <section>
                <h4 style="margin-bottom: 0.75rem; color: var(--azul-oscuro);">${escapeHtml(equipoQuirurgico?.titulo || "Ubicación del equipo quirúrgico")}</h4>
                <ul style="margin-left: 1.5rem;">
                    ${Array.isArray(equipoQuirurgico?.roles) ? equipoQuirurgico.roles.map(role => `
                        <li style="margin-bottom: 0.5rem;">
                            <strong>${escapeHtml(role.rol)}:</strong> ${escapeHtml(role.posicion)}
                        </li>
                    `).join('') : ''}
                </ul>
                ${equipoQuirurgico?.imagen ? `<img src="${equipoQuirurgico.imagen}" alt="Ubicación del equipo quirúrgico" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="${equipoQuirurgico.large ? 'planeamiento-imagen-large' : 'planeamiento-imagen'}" loading="eager">` : ''}
                ${renderPlaneamientoImageGallery(equipoQuirurgico?.imagenes || [], "Equipo quirúrgico", true)}
            </section>
        </div>
    `;
    }

    function renderEtapaEjecucion(ejecucion) {
    return `
        <div class="etapa-panel" data-etapa="ejecucion" style="display: none;">
            <section style="margin-bottom: 1.5rem;">
                <p><strong>Anestesia:</strong> ${escapeHtml(ejecucion.anestesia)}</p>
                ${ejecucion.anestesiaImagen ? `<img src="${ejecucion.anestesiaImagen}" alt="Anestesia general" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
                <p><strong>Incisión:</strong> ${escapeHtml(ejecucion.incision.nombre)} (${escapeHtml(ejecucion.incision.tipo)})</p>
                <p style="font-size: 0.95rem; color: #666;">${escapeHtml(ejecucion.incision.descripcion)}</p>
                ${ejecucion.incision.imagen ? `<img src="${ejecucion.incision.imagen}" alt="Incisión quirúrgica" style="max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.5rem; cursor: pointer; object-fit: contain;" class="planeamiento-imagen" loading="eager">` : ''}
            </section>
            
            <section>
                <h4 style="margin-bottom: 1rem; color: var(--azul-oscuro);">Pasos Quirúrgicos</h4>
                <div style="max-height: 600px; overflow-y: auto;">
                    ${Array.isArray(ejecucion.pasos) ? ejecucion.pasos.map(paso => `
                        <div style="margin-bottom: 1rem; padding: 1rem; background-color: #f9f9f9; border-left: 3px solid var(--azul-pastel); border-radius: 4px;">
                            <p style="margin: 0 0 0.5rem 0;"><strong>Paso ${paso.paso}:</strong> ${escapeHtml(paso.tecnica)}</p>
                            <div style="font-size: 0.9rem; color: #666; margin-left: 1rem;">
                                <p style="margin: 0.25rem 0;"><strong>Instrumental:</strong></p>
                                <ul style="margin: 0.25rem 0 0 1.5rem; padding: 0;">
                                    ${Array.isArray(paso.instrumental) ? paso.instrumental.map(inst => `<li>${escapeHtml(inst)}</li>`).join('') : ''}
                                </ul>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            </section>
        </div>
    `;
    }

    function bindPlaneamientoTabs() {
    const tabs = document.querySelectorAll('.etapa-tab');
    const panels = document.querySelectorAll('.etapa-panel');

    // Ensure the currently marked active tab is visually active on init
    // (some tabs are rendered with class "active" / aria-selected by the renderer)
    tabs.forEach(t => {
        t.style.borderBottomColor = 'transparent';
        t.style.color = 'inherit';
    });
    panels.forEach(p => { p.style.display = 'none'; });
    const initial = document.querySelector('.etapa-tab.active') || tabs[0];
    if (initial) {
        const etapa = initial.dataset.etapa;
        initial.classList.add('active');
        initial.setAttribute('aria-selected', 'true');
        initial.style.borderBottomColor = 'var(--azul-pastel)';
        initial.style.color = 'var(--azul-pastel)';
        const panel = document.querySelector(`.etapa-panel[data-etapa="${etapa}"]`);
        if (panel) panel.style.display = 'block';
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const etapa = tab.dataset.etapa;
            
            // Deactivate all tabs and panels
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
                t.style.borderBottomColor = 'transparent';
                t.style.color = 'inherit';
            });
            
            panels.forEach(panel => {
                panel.style.display = 'none';
            });
            
            // Activate selected tab and panel
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            tab.style.borderBottomColor = 'var(--azul-pastel)';
            tab.style.color = 'var(--azul-pastel)';
            
            const panel = document.querySelector(`.etapa-panel[data-etapa="${etapa}"]`);
            if (panel) {
                panel.style.display = 'block';
            }
        });
    });
    }

    function initSearch() {
    const searchInput = document.querySelector(".search-bar input");
    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", () => {
        window.clearTimeout(searchTimeoutId);
        searchTimeoutId = window.setTimeout(() => {
        const activeFilter = document.querySelector(".filter-btn.active");
        const category = activeFilter ? activeFilter.dataset.category || "Todos" : "Todos";
        filterEquipos(category);
        }, 300);
    });
    }

    function observeFadeIns() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll(".fade-in:not(.visible)");

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
        }
        });
    }, { threshold: 0.15 });

    elements.forEach((element) => observer.observe(element));
    }

    function initBackToTop() {
    const button = document.querySelector(".back-to-top");
    if (!button) {
        return;
    }

    const toggleButton = () => {
        button.classList.toggle("is-visible", window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleButton, { passive: true });
    toggleButton();

    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    }

    function initHamburgerMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navPanel = document.querySelector(".nav-panel");
    if (!hamburger || !navPanel) {
        return;
    }

    const closeMenu = () => {
        navPanel.classList.remove("nav-open");
        hamburger.setAttribute("aria-expanded", "false");
    };

    hamburger.addEventListener("click", () => {
        const isOpen = navPanel.classList.toggle("nav-open");
        hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (!navPanel.classList.contains("nav-open")) {
        return;
        }
        const target = event.target;
        if (target instanceof Node && !navPanel.contains(target) && !hamburger.contains(target)) {
        closeMenu();
        }
    });
    }

    function initModalEvents() {
    const modal = document.querySelector(".modal");
    if (!modal) {
        return;
    }

    // avoid attaching listeners multiple times
    if (modal.dataset.initialized === "true") {
        return;
    }

    modal.addEventListener("click", (event) => {
        // close when clicking the overlay element
        if (event.target && event.target.classList && event.target.classList.contains('modal-overlay')) {
        closeModal();
        }

        const target = event.target;
        if (!(target instanceof Element)) {
        return;
        }

        const partsButton = target.closest("[data-open-parts-image]");
        if (partsButton) {
        const src = partsButton.getAttribute("data-parts-image-src") || "";
        const alt = partsButton.getAttribute("data-parts-image-alt") || "Imagen ampliada de partes";
        openImageViewer(src, alt);
        }
    });

    modal.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    const onKeydown = (event) => {
        if (event.key !== "Escape") {
        const viewer = document.querySelector(".image-viewer-modal");
        const viewerOpen = !!(viewer && viewer.classList.contains("is-open"));
        if (viewerOpen && (event.key === "+" || event.key === "=")) {
            event.preventDefault();
            zoomImageViewerIn();
            return;
        }
        if (viewerOpen && event.key === "-") {
            event.preventDefault();
            zoomImageViewerOut();
            return;
        }
        if (viewerOpen && event.key === "0") {
            event.preventDefault();
            resetImageViewerZoom();
            return;
        }
        return;
        }

        const viewer = document.querySelector(".image-viewer-modal");
        if (viewer && viewer.classList.contains("is-open")) {
        closeImageViewer();
        return;
        }

        if (modal.classList.contains("is-open")) {
        closeModal();
        }
    };

    const imageViewer = ensureImageViewerModal();
    imageViewer.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
        return;
        }

        if (target.matches("[data-image-zoom-in]") || target.closest("[data-image-zoom-in]")) {
        zoomImageViewerIn();
        return;
        }

        if (target.matches("[data-image-zoom-out]") || target.closest("[data-image-zoom-out]")) {
        zoomImageViewerOut();
        return;
        }

        if (target.matches("[data-image-zoom-reset]") || target.closest("[data-image-zoom-reset]")) {
        resetImageViewerZoom();
        return;
        }

        if (target.matches("[data-close-image-viewer]") || target.closest("[data-close-image-viewer]")) {
        closeImageViewer();
        }
    });

    imageViewer.addEventListener("wheel", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
        return;
        }

        const viewerOpen = imageViewer.classList.contains("is-open");
        const overStage = !!target.closest(".image-viewer-stage");
        if (!viewerOpen || !overStage) {
        return;
        }

        event.preventDefault();
        if (event.deltaY < 0) {
        setImageViewerScaleAtPoint(currentImageViewerScale + IMAGE_VIEWER_SCALE_STEP, event.clientX, event.clientY);
        } else {
        setImageViewerScaleAtPoint(currentImageViewerScale - IMAGE_VIEWER_SCALE_STEP, event.clientX, event.clientY);
        }
    }, { passive: false });

    imageViewer.addEventListener("pointerdown", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
        return;
        }

        const viewerOpen = imageViewer.classList.contains("is-open");
        const overStage = !!target.closest(".image-viewer-stage");
        if (!viewerOpen || !overStage || currentImageViewerScale <= IMAGE_VIEWER_MIN_SCALE) {
        return;
        }

        if (event.pointerType === "mouse" && event.button !== 0) {
        return;
        }

        isImageViewerPanning = true;
        imageViewerPanPointerId = event.pointerId;
        imageViewerPanStartX = event.clientX;
        imageViewerPanStartY = event.clientY;
        imageViewerPanStartOffsetX = currentImageViewerOffsetX;
        imageViewerPanStartOffsetY = currentImageViewerOffsetY;
        imageViewer.setPointerCapture(event.pointerId);
        imageViewer.classList.add("is-panning");
        event.preventDefault();
    });

    imageViewer.addEventListener("pointermove", (event) => {
        if (!isImageViewerPanning || event.pointerId !== imageViewerPanPointerId) {
        return;
        }

        const deltaX = event.clientX - imageViewerPanStartX;
        const deltaY = event.clientY - imageViewerPanStartY;
        setImageViewerScale(currentImageViewerScale, imageViewerPanStartOffsetX + deltaX, imageViewerPanStartOffsetY + deltaY);
    });

    const stopPanning = (event) => {
        if (!isImageViewerPanning || event.pointerId !== imageViewerPanPointerId) {
        return;
        }

        isImageViewerPanning = false;
        imageViewerPanPointerId = null;
        imageViewer.classList.remove("is-panning");
        if (imageViewer.hasPointerCapture(event.pointerId)) {
        imageViewer.releasePointerCapture(event.pointerId);
        }
    };

    imageViewer.addEventListener("pointerup", stopPanning);
    imageViewer.addEventListener("pointercancel", stopPanning);

    document.addEventListener("keydown", onKeydown);
    modal.dataset.initialized = "true";
    }

    function initEquiposPage() {
    loadEquipos().then((equipos) => {
        const hasGrid = document.querySelector(".equipos-grid");
        if (!hasGrid) {
        return;
        }
        renderEquipos(equipos);
        initFilters();
        initSearch();
        initModalEvents();
    });
    }

    function initCurrentPage() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("planeamientos")) {
        // initialize planeamientos UI (cards + filters + modal)
        initPlaneamientosPage();
    }

    if (path.includes("equipos")) {
        initEquiposPage();
    }
    }

    function normalizeText(value) {
    return String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function initGlobalEvents() {
    initHamburgerMenu();
    initBackToTop();
    observeFadeIns();
    // ensure modal handlers are ready on any page
    initModalEvents();
    initCurrentPage();
    }

    window.toggleDarkMode = toggleDarkMode;
    window.loadEquipos = loadEquipos;
    window.renderEquipos = renderEquipos;
    window.filterEquipos = filterEquipos;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.initAccordion = initAccordion;
    window.initFilters = initFilters;

    window.addEventListener("DOMContentLoaded", () => {
    initGlobalEvents();
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
});
