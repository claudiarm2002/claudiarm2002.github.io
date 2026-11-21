/* Navalla · tema «quadern de camp»: logo, icones dibuixades, títol per eina, botó d'actualitzar.
   Les icones d'una sola línia substitueixen els emojis en pantalla (no cal tocar la lògica de les eines). */
(function(){
var ICO={"gpx":{"n":"gpx","d":["M8 88 C10.7 88.7 18.3 92.3 24 92 C29.7 91.7 37 88.7 42 86 C47 83.3 53.3 79.3 54 76 C54.7 72.7 50 68.3 46 66 C42 63.7 33 64.3 30 62 C27 59.7 26.3 54.7 28 52 C29.7 49.3 35.3 46.3 40 46 C44.7 45.7 51.7 48.3 56 50 C60.3 51.7 63.3 55.7 66 56 C68.7 56.3 71 52.7 72 52","M72 54 C70 51.7 62.3 44.3 60 40 C57.7 35.7 57.3 31.8 58 28 C58.7 24.2 61.2 19.3 64 17 C66.8 14.7 71.5 13.5 75 14 C78.5 14.5 83 17.2 85 20 C87 22.8 87.5 27.2 87 31 C86.5 34.8 84.5 39.2 82 43 C79.5 46.8 73.7 52.2 72 54","M72 22 C74 22 77.3 24.2 78 26 C78.7 27.8 77.5 31.8 76 33 C74.5 34.2 70.7 34.2 69 33 C67.3 31.8 65.5 27.8 66 26 C66.5 24.2 70 22 72 22","M10 96 C14 96.2 25.7 97 34 97 C42.3 97 55.7 96.2 60 96"],"b":"M69.2 84.2 C62.7 88.4 52.4 90.9 45 90.1 C37.6 89.3 31.9 83.8 24.8 79.4 C17.7 75 3 69.7 2.3 63.8 C1.7 57.9 15.4 50.4 20.7 44.1 C25.9 37.7 27 29.6 34 25.7 C40.9 21.8 55.9 17.7 62.4 20.8 C69 24 69.6 37.4 73.3 44.8 C76.9 52.2 84.8 58.4 84.1 65 C83.4 71.5 75.8 80 69.2 84.2"},"despeses":{"n":"despeses","d":["M14 90 C18.3 89.5 31.3 87.2 40 87 C48.7 86.8 57.3 89 66 89 C74.7 89 87.7 87.3 92 87","M20 89 C19.8 85.8 18.8 74.5 19 70 C19.2 65.5 18.7 63.5 21 62 C23.3 60.5 30.7 59.7 33 61 C35.3 62.3 34.8 65.3 35 70 C35.2 74.7 34.2 85.8 34 89","M42 89 C41.8 83.8 40.8 65.2 41 58 C41.2 50.8 40.7 48.2 43 46 C45.3 43.8 52.7 43 55 45 C57.3 47 56.8 50.7 57 58 C57.2 65.3 56.2 83.8 56 89","M64 89 C63.8 81.5 62.8 53.8 63 44 C63.2 34.2 62.7 32.5 65 30 C67.3 27.5 74.7 26.7 77 29 C79.3 31.3 78.8 34 79 44 C79.2 54 78.2 81.5 78 89","M12 52 C14.3 50.3 21 45.3 26 42 C31 38.7 36.7 35.3 42 32 C47.3 28.7 52.7 25.3 58 22 C63.3 18.7 68.7 14.8 74 12 C79.3 9.2 87.3 6.2 90 5","M34 37 C33 36.5 29.4 35.3 28.3 33.7 C27.2 32.1 27 29.2 27.3 27.2 C27.6 25.3 29.5 22.9 30 22 C30.8 22.7 33.5 24.6 34.6 26.2 C35.7 27.9 36.6 30 36.5 31.8 C36.4 33.6 34.4 36.1 34 37","M52 27 C51.1 26.4 47.8 24.8 46.9 23.1 C46 21.4 46.2 18.6 46.7 16.7 C47.3 14.9 49.5 12.8 50 12 C50.7 12.8 53.1 14.9 53.9 16.7 C54.8 18.4 55.4 20.6 55 22.3 C54.7 24 52.5 26.2 52 27","M70 15 C71 14.4 74.2 11.8 76.3 11.7 C78.4 11.6 81.2 13.1 82.8 14.5 C84.4 15.9 85.5 19.1 86 20 C84.9 20.3 81.6 21.7 79.5 21.8 C77.4 21.8 74.9 21.4 73.3 20.2 C71.7 19.1 70.5 15.9 70 15","M82 8 C82.9 7.7 85.6 6.2 87.3 6.4 C89 6.7 90.9 8.2 92.1 9.5 C93.2 10.7 93.7 13.2 94 14 C93.1 14.1 90.4 14.7 88.7 14.4 C87 14.1 85.1 13.4 84 12.4 C82.9 11.3 82.3 8.7 82 8"],"b":"M85.3 68.3 C83 75.5 78.9 83.4 72.2 88 C65.5 92.6 54.3 95.7 44.9 95.9 C35.5 96 22.7 93.7 15.9 88.9 C9.2 84 5.9 74.5 4.5 66.9 C3.1 59.4 2.2 48 7.6 43.4 C12.9 38.9 27.7 40.9 36.4 39.5 C45.1 38 51.4 33.6 59.7 34.5 C67.9 35.4 81.6 39.2 85.9 44.9 C90.2 50.5 87.5 61.1 85.3 68.3"},"tasques":{"n":"tasques","d":["M32 70 C33.3 69.7 36.7 68.2 40 68 C43.3 67.8 47.7 69.2 52 69 C56.3 68.8 63 67 66 67 C69 67 69.3 68.7 70 69 C69.3 70.8 67.2 76.5 66 80 C64.8 83.5 65.7 88.2 63 90 C60.3 91.8 53.8 91 50 91 C46.2 91 42.3 91.8 40 90 C37.7 88.2 37.2 83.2 36 80 C34.8 76.8 33.5 72.5 33 71","M50 69 C49.7 66.8 47.8 60.5 48 56 C48.2 51.5 50.8 46.7 51 42 C51.2 37.3 48.8 32.7 49 28 C49.2 23.3 50.8 17.7 52 14 C53.2 10.3 55.3 7.3 56 6","M49 57 C50.7 57.4 56.1 60.1 59.2 59.4 C62.3 58.7 65.6 55.6 67.4 53 C69.2 50.4 69.6 45.5 70 44 C68.3 44 63.1 43.2 60.1 43.9 C57 44.6 53.6 46.1 51.8 48.3 C49.9 50.5 49.5 55.6 49 57","M49 57 C50.4 56.2 55 53.7 57.6 52.1 C60.2 50.5 63 48.4 64.8 47.2 C66.5 46.1 67.4 45.6 67.9 45.3","M49 45 C47.5 45.6 42.7 49 39.7 48.9 C36.7 48.8 33 46.3 30.9 44.1 C28.7 42 27.6 37.4 27 36 C28.6 35.7 33.4 34.1 36.4 34.3 C39.4 34.5 42.9 35.4 45 37.2 C47.1 39 48.3 43.7 49 45","M49 45 C47.5 44.5 42.8 42.9 40.1 41.7 C37.3 40.6 34.3 39.1 32.5 38.2 C30.7 37.4 29.8 37.1 29.2 36.9","M50 32 C51.5 32.4 56 35 58.8 34.6 C61.6 34.2 64.9 31.7 66.8 29.6 C68.6 27.5 69.5 23.3 70 22 C68.5 21.9 64 20.9 61.2 21.4 C58.4 21.8 55.2 22.9 53.4 24.7 C51.5 26.5 50.6 30.8 50 32","M50 32 C51.4 31.4 55.6 29.5 58.1 28.3 C60.6 27 63.4 25.4 65 24.5 C66.6 23.6 67.5 23.2 68 23","M50 22 C48.9 22.1 45.2 23.3 43.2 22.6 C41.2 22 38.9 19.7 37.7 17.9 C36.5 16.1 36.3 13 36 12 C37.1 12.1 40.6 12.1 42.6 12.8 C44.7 13.5 46.9 14.8 48.2 16.3 C49.4 17.8 49.7 21 50 22","M50 22 C49 21.4 46 19.4 44.3 18.2 C42.5 16.9 40.6 15.4 39.5 14.5 C38.4 13.6 37.8 13.2 37.4 13","M53 13 C53.9 12.8 56.8 13 58.1 12.1 C59.4 11.2 60.3 9.1 60.6 7.6 C60.9 6.1 60.1 3.8 60 3 C59.2 3.3 56.7 4 55.5 4.9 C54.2 5.8 53 7.2 52.6 8.5 C52.2 9.9 52.9 12.3 53 13"],"b":"M89.8 62 C90.4 68.6 90.4 78 86.1 83 C81.8 87.9 71.7 90.4 63.9 91.7 C56.1 93 46.1 94 39.2 91 C32.2 88 23.7 79.9 22.3 73.6 C20.9 67.2 27 58.7 30.6 53.1 C34.2 47.6 38.1 44.8 43.9 40.2 C49.6 35.7 58.7 25.2 65.2 25.8 C71.6 26.4 78.5 37.6 82.7 43.6 C86.8 49.6 89.3 55.4 89.8 62"},"ruta":{"n":"ruta","d":["M43.3 27.1 C45 27.1 50.1 26.6 53.3 27.2 C56.6 27.8 60 29 62.9 30.7 C65.8 32.4 68.6 34.8 70.7 37.4 C72.9 40 74.7 43.2 75.8 46.3 C76.9 49.5 77.5 53 77.5 56.3 C77.5 59.7 76.9 63.1 75.9 66.2 C74.9 69.4 73.4 72.4 71.5 75.1 C69.6 77.7 67.3 80.2 64.8 82.2 C62.2 84.2 59.3 86 56.3 87.2 C53.2 88.4 49.9 89.3 46.6 89.5 C43.2 89.8 39.7 89.5 36.4 88.7 C33.1 87.9 29.7 86.5 26.8 84.6 C24 82.7 21.3 80.1 19.2 77.3 C17.2 74.5 15.5 71.2 14.5 67.9 C13.6 64.5 13.2 60.9 13.4 57.4 C13.6 54 14.5 50.5 15.7 47.3 C17 44.2 18.9 41.2 21 38.6 C23.1 36 25.7 33.7 28.5 31.9 C31.3 30 34.4 28.5 37.6 27.5 C40.8 26.6 46 26.2 47.7 26 C49.4 25.7 47.7 26 47.7 26","M46 27 C46 25.8 46 21.2 46 20","M39 18 C40.2 17.8 43.7 17 46 17 C48.3 17 51.8 17.8 53 18","M46 34 C46 33.3 46 30.7 46 30","M70 58 C70.7 58 73.3 58 74 58","M46 82 C46 82.7 46 85.3 46 86","M22 58 C21.3 58 18.7 58 18 58","M46 58 C46.2 56.5 47.2 52 47 49 C46.8 46 45.3 41.5 45 40","M46 58 C47.3 58.7 51.7 60.2 54 62 C56.3 63.8 59 67.8 60 69","M68 34 C70 32 76.7 25.7 80 22 C83.3 18.3 86 15.3 88 12 C90 8.7 91.3 3.7 92 2","M80 21 C80.5 21.9 81.7 25.1 83.3 26.1 C84.9 27.1 87.5 27.1 89.3 26.7 C91.1 26.4 93.2 24.5 94 24 C93.3 23.3 91.4 20.9 89.9 20 C88.3 19 86.3 18.3 84.6 18.5 C83 18.7 80.8 20.6 80 21","M87 13 C86.1 13.2 83.2 14.6 81.6 14.2 C80 13.8 78.2 12.1 77.3 10.8 C76.4 9.4 76.2 6.8 76 6 C76.9 6 79.7 5.6 81.3 6 C82.9 6.4 84.6 7.2 85.6 8.4 C86.6 9.6 86.8 12.2 87 13"],"b":"M67.7 86.4 C61.5 90.8 54.3 98.5 47.3 98.5 C40.3 98.5 30.4 92.3 25.5 86.4 C20.7 80.6 17.9 70.7 18.4 63.6 C18.8 56.5 24.1 50.5 28.3 44 C32.5 37.5 36.7 27.3 43.6 24.6 C50.5 21.8 63 23.7 69.7 27.7 C76.4 31.7 81.1 41.4 83.5 48.8 C86 56.2 87.2 65.9 84.5 72.1 C81.9 78.4 73.9 82 67.7 86.4"},"motxilla":{"n":"motxilla","d":["M38 24 C38.3 22.3 38 16.5 40 14 C42 11.5 46.7 9 50 9 C53.3 9 58 11.5 60 14 C62 16.5 61.7 22.3 62 24","M32 30 C33.3 29 36.7 25.3 40 24 C43.3 22.7 48 22 52 22 C56 22 60.7 22.7 64 24 C67.3 25.3 69.8 26.7 72 30 C74.2 33.3 76 38.3 77 44 C78 49.7 78.2 57.7 78 64 C77.8 70.3 77.7 77.8 76 82 C74.3 86.2 72.3 87.5 68 89 C63.7 90.5 55.8 91 50 91 C44.2 91 37.2 90.5 33 89 C28.8 87.5 26.7 86.5 25 82 C23.3 77.5 23.2 68.3 23 62 C22.8 55.7 23.2 48.7 24 44 C24.8 39.3 26 36.8 28 34 C30 31.2 34.7 28.2 36 27","M24 46 C26 47 31.7 50.7 36 52 C40.3 53.3 45.3 54 50 54 C54.7 54 59.5 53.3 64 52 C68.5 50.7 74.8 47 77 46","M31 88 C30.8 85.3 29.5 76 30 72 C30.5 68 30.7 65.7 34 64 C37.3 62.3 44.7 62 50 62 C55.3 62 62.7 62.3 66 64 C69.3 65.7 69.5 68 70 72 C70.5 76 69.2 85.3 69 88","M50 54 C50 55.5 50 61.5 50 63","M38 40 C37.3 41.7 34.8 46.7 34 50 C33.2 53.3 33.2 58.3 33 60","M62 40 C62.7 41.7 65.2 46.7 66 50 C66.8 53.3 66.8 58.3 67 60","M70 26 C71.3 24.3 75.3 18.7 78 16 C80.7 13.3 84 12.3 86 10 C88 7.7 89.3 3.3 90 2","M79 15 C79.8 14.3 81.8 11.6 83.5 11.1 C85.2 10.6 87.8 11.3 89.3 12.2 C90.9 13 92.4 15.4 93 16 C92.2 16.4 89.7 18.2 88 18.7 C86.3 19.1 84.2 19.3 82.7 18.6 C81.2 18 79.6 15.6 79 15","M85 10 C85 9.2 85.4 6.2 84.7 4.9 C84 3.6 82 2.4 80.6 1.9 C79.1 1.5 76.8 2 76 2 C76.2 2.8 76.6 5.3 77.3 6.7 C78.1 8 79.3 9.4 80.6 9.9 C81.8 10.5 84.3 10 85 10"],"b":"M72.5 73 C69.2 79.9 63.8 86.7 56.8 91.1 C49.8 95.5 38 101.1 30.4 99.3 C22.9 97.5 16.1 87 11.7 80.2 C7.3 73.3 3.8 65.6 3.9 58.3 C4.1 50.9 7.2 40.5 12.6 36 C18 31.4 28.3 31.7 36.2 30.9 C44 30.2 53 28.2 59.7 31.3 C66.4 34.4 74.2 42.5 76.4 49.4 C78.5 56.4 75.7 66 72.5 73"},"idea":{"n":"idea","d":["M40 68 C39.3 66.3 38 61.3 36 58 C34 54.7 29.5 51.7 28 48 C26.5 44.3 26 40.3 27 36 C28 31.7 30.5 25.3 34 22 C37.5 18.7 43.3 16.3 48 16 C52.7 15.7 58.2 17.3 62 20 C65.8 22.7 69.5 27.7 71 32 C72.5 36.3 72.2 41.7 71 46 C69.8 50.3 65.8 54.3 64 58 C62.2 61.7 60.7 66.3 60 68","M40 68 C41.7 68.5 46.7 71 50 71 C53.3 71 58.3 68.5 60 68","M41 77 C42.5 77.3 47 79 50 79 C53 79 57.5 77.3 59 77","M45 86 C45.8 86.3 48.3 88 50 88 C51.7 88 54.2 86.3 55 86","M44 54 C44.3 52.3 45 44.3 46 44 C47 43.7 48.7 52 50 52 C51.3 52 53 43.7 54 44 C55 44.3 55.7 52.3 56 54","M50 3 C50 4 50 8 50 9","M20 12 C20.8 12.8 24.2 16.2 25 17","M80 12 C79.2 12.8 75.8 16.2 75 17","M8 40 C9.2 40 13.8 40 15 40","M92 40 C90.8 40 86.2 40 85 40"],"b":"M75.5 53.4 C73.6 58.9 70.2 64.5 65.3 68.3 C60.4 72.1 53 76.1 45.9 76.3 C38.9 76.5 27.1 74.3 23 69.5 C19 64.7 20.7 53.9 21.4 47.3 C22.2 40.7 23.9 34.8 27.5 30 C31.2 25.1 36.7 21.1 43.4 18.5 C50 15.9 61.8 11.5 67.3 14.3 C72.8 17.1 75.1 29 76.5 35.5 C77.8 42 77.4 48 75.5 53.4"},"people":{"n":"people","d":["M66 24 C68.7 24 73.3 25.7 75 28 C76.7 30.3 77.5 35.7 76 38 C74.5 40.3 69 42.3 66 42 C63 41.7 59.2 38.3 58 36 C56.8 33.7 57.7 30 59 28 C60.3 26 63.3 24 66 24","M50 58 C51.7 57 56.3 53 60 52 C63.7 51 68.2 51 72 52 C75.8 53 80.3 55 83 58 C85.7 61 87.2 65 88 70 C88.8 75 88 85 88 88","M34 28 C38.2 28 44 30.3 46 34 C48 37.7 48 46.3 46 50 C44 53.7 38 56 34 56 C30 56 24.2 53.7 22 50 C19.8 46.3 19 37.7 21 34 C23 30.3 29.8 28 34 28","M8 90 C8.3 87 8 76.7 10 72 C12 67.3 16 64 20 62 C24 60 29.3 60 34 60 C38.7 60 44 60 48 62 C52 64 56 67.3 58 72 C60 76.7 59.7 87 60 90"],"b":"M78.9 75.7 C75.7 81.9 67.6 91.4 60.8 92.5 C53.9 93.6 46.4 85 37.7 82.3 C29 79.5 13.4 81.5 8.5 75.8 C3.5 70.2 5.5 56.9 8 48.4 C10.4 39.8 15.6 27.7 23 24.3 C30.4 20.8 44.3 25.5 52.6 27.6 C60.9 29.7 68.4 32.3 73.1 36.9 C77.7 41.5 79.4 48.9 80.4 55.3 C81.4 61.8 82.2 69.5 78.9 75.7"},"trash":{"n":"trash","d":["M40 18 C40.3 16.7 39 11.3 42 10 C45 8.7 55 8.7 58 10 C61 11.3 59.7 16.7 60 18","M16 24 C21.7 23.3 38.7 20 50 20 C61.3 20 78.3 23.3 84 24","M26 28 C26.7 33 28.8 48 30 58 C31.2 68 29.7 82.7 33 88 C36.3 93.3 44.3 90 50 90 C55.7 90 63.7 93.3 67 88 C70.3 82.7 68.8 68 70 58 C71.2 48 73.3 33 74 28","M41 40 C41.2 46 41.8 70 42 76","M59 40 C58.8 46 58.2 70 58 76"],"b":"M72.4 79.1 C66.6 83.5 58.7 85.8 52.2 85.9 C45.6 86 39.9 82.9 33 79.5 C26.2 76.2 13.5 72.3 11 65.8 C8.6 59.4 14.4 47.9 18.3 40.7 C22.3 33.4 28.1 25.4 34.9 22.4 C41.8 19.4 52.5 19.9 59.5 22.5 C66.5 25.1 72.1 31.7 76.7 37.9 C81.3 44.1 88 52.9 87.3 59.8 C86.6 66.7 78.3 74.8 72.4 79.1"},"pencil":{"n":"pencil","d":["M20 84 C20.8 81 17.7 76 25 66 C32.3 56 55.3 29.2 64 24 C72.7 18.8 81.5 26.3 77 35 C72.5 43.7 46.5 67.8 37 76 C27.5 84.2 22.8 82.7 20 84","M58 30 C60.2 32 68.8 40 71 42","M25 66 C26.8 67.7 34.2 74.3 36 76"],"b":"M79.6 62 C77.1 69.7 76.3 78.8 71.2 82.6 C66.2 86.4 57.1 84.5 49.3 84.9 C41.4 85.3 29.1 89.2 24.3 85.1 C19.5 81 21 68.3 20.4 60.5 C19.7 52.6 17.5 45 20.3 37.8 C23.1 30.7 30.2 19.7 37.2 17.7 C44.1 15.7 53.7 22.7 61.9 25.8 C70 28.9 83.1 30.4 86 36.4 C89 42.4 82 54.3 79.6 62"},"map":{"n":"map","d":["M12 28 C16 26.3 28 17.7 36 18 C44 18.3 51.3 30 60 30 C68.7 30 83.3 10.7 88 18 C92.7 25.3 92.7 62.7 88 74 C83.3 85.3 68.7 86 60 86 C51.3 86 44 74.3 36 74 C28 73.7 16 91.7 12 84 C8 76.3 12 37.3 12 28","M36 18 C36 27.3 36 64.7 36 74","M60 30 C60 39.3 60 76.7 60 86","M18 66 C19.3 64.3 23 57 26 56 C29 55 33 61.3 36 60 C39 58.7 42.7 50 44 48","M62 40 C63.7 42 70.3 50 72 52","M72 40 C70.3 42 63.7 50 62 52"],"b":"M83.3 69.3 C79.7 75.4 72 81.4 64.2 84.5 C56.3 87.7 43.5 91 36.2 88.5 C28.8 85.9 23.6 75.8 20.1 69.3 C16.6 62.9 14.9 56.5 15.4 49.6 C15.8 42.7 17.1 32.5 22.8 27.9 C28.4 23.4 40.9 21.8 49.1 22.2 C57.4 22.6 66.2 26.3 72.3 30.6 C78.4 34.8 83.9 41.5 85.7 48 C87.5 54.4 86.9 63.2 83.3 69.3"}};
function svg(ic,blob){return '<svg class="nv'+(ic.n?' k-'+ic.n:'')+'" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(blob&&ic.b?'<path class="bl" d="'+ic.b+'"/>':'')+ic.d.map(function(d){return '<path d="'+d+'"/>'}).join('')+'</svg>'}

/* ---- capçalera i logo ---- */
var h=document.querySelector('header'),h1=h&&h.querySelector('h1');
if(h1){
 if(h1.firstChild&&h1.firstChild.nodeType===3)h1.firstChild.nodeValue='Navalla';
 var lg=document.createElement('span');lg.className='lg';
 lg.innerHTML='<svg viewBox="0 0 100 100" width="62" height="62" aria-hidden="true"><path class="lb" d="M81.9 67.5 C79.7 74 72.5 82.3 64.9 85.8 C57.3 89.3 43.3 91.6 36.2 88.5 C29 85.3 26.4 74.1 22.1 67.1 C17.8 60.1 9.9 53.5 10.2 46.6 C10.6 39.7 17.6 30.6 24.1 25.8 C30.6 21 41.7 16.8 49.1 17.7 C56.5 18.6 63.8 26.4 68.6 31.3 C73.4 36.2 75.7 41 77.9 47 C80.2 53 84.1 61 81.9 67.5"/><path d="M6 72 C9 67.7 19.3 48.3 24 46 C28.7 43.7 29.3 61.7 34 58 C38.7 54.3 46.7 25 52 24 C57.3 23 62.3 49 66 52 C69.7 55 69.3 38.7 74 42 C78.7 45.3 90.7 67 94 72" fill="none" stroke="currentColor" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 h.insertBefore(lg,h1);
}
var m=document.querySelector('meta[name=theme-color]');if(m)m.content='#1f3a2a';
function tag(){document.body.dataset.tool=location.hash.slice(1)}
window.addEventListener('hashchange',tag);tag();
var K=[['Repara','gpx'],['Despeses','despeses'],['Tasques','tasques'],['Checklist','motxilla'],['Temps de ruta','ruta']],box=document.getElementById('tools');
function paint(){Array.prototype.forEach.call(box.children,function(b){var t=b.textContent;K.forEach(function(k){if(t.indexOf(k[0])>=0)b.dataset.k=k[1]})})}
if(box){paint();new MutationObserver(paint).observe(box,{childList:true})}
var hi=new Date().getHours(),gp=document.querySelector('#home>p.mu');if(gp)gp.textContent=(hi<13?'Bon dia':hi<20?'Bona tarda':'Bona nit')+'. Què necessites avui?';

/* ---- emojis → dibuixos d'una línia (o fora) ---- */
var EMRE=/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*|[\uFE0F\u200D]/gu;
var EMT=/\p{Extended_Pictographic}|[\uFE0F\u200D]/u;
var KEEP=/^[©®™✓✕⌖]/;
var TOOLI={'🛠':ICO.gpx,'💶':ICO.despeses,'🧹':ICO.tasques,'⏱':ICO.ruta,'🎒':ICO.motxilla};
var UII={'💡':ICO.idea,'👥':ICO.people,'🗑':ICO.trash,'✏':ICO.pencil,'🗺':ICO.map};
function inside(p,sel){return p&&p.closest&&p.closest(sel)}
function fix(n){
 var v=n.nodeValue;if(!EMT.test(v))return;
 var p=n.parentNode,re=new RegExp(EMRE.source,'gu'),parts=[],last=0,mm,has=false,lead=/^\s*\p{Extended_Pictographic}/u.test(v);
 while((mm=re.exec(v))){
  if(KEEP.test(mm[0]))continue;
  var k=mm[0].replace(/[\uFE0F\u200D]/g,''),icn=null;
  if(TOOLI[k]&&inside(p,'#tools .ic'))icn=TOOLI[k];
  else if(UII[k]&&!inside(p,'.tq-id'))icn=UII[k];
  parts.push([v.slice(last,mm.index),icn,!!TOOLI[k]&&!!icn]);last=mm.index+mm[0].length;if(icn)has=true;
 }
 parts.push([v.slice(last),null]);
 if(!has){
  var s=parts.map(function(x){return x[0]}).join('').replace(/ {2,}/g,' ');if(lead)s=s.replace(/^\s+/,'');
  if(s!==v)n.nodeValue=s;return;
 }
 var f=document.createDocumentFragment();
 parts.forEach(function(x){
  if(x[0])f.appendChild(document.createTextNode(x[0]));
  if(x[1]){var sp=document.createElement('span');sp.className='nvw';sp.innerHTML=svg(x[1],true);f.appendChild(sp)}
 });
 p.replaceChild(f,n);
}
function clean(){
 var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),a=[],n;
 while((n=w.nextNode())){var pn=n.parentNode&&n.parentNode.nodeName;if(pn==='SCRIPT'||pn==='STYLE'||pn==='TEXTAREA')continue;if(EMT.test(n.nodeValue))a.push(n)}
 a.forEach(fix);
 Array.prototype.forEach.call(document.querySelectorAll('[placeholder],[title],[aria-label]'),function(e){
  ['placeholder','title','aria-label'].forEach(function(at){
   var v=e.getAttribute(at);
   if(v&&EMT.test(v))e.setAttribute(at,v.replace(new RegExp(EMRE.source,'gu'),function(x){return KEEP.test(x)?x:''}).replace(/^\s+/,'').replace(/ {2,}/g,' '));
  });
 });
}
var busy=false,obs;
function run(){if(busy)return;busy=true;try{clean()}catch(_){}busy=false;if(obs)obs.takeRecords()}
obs=new MutationObserver(run);obs.observe(document.body,{childList:true,subtree:true,characterData:true});
run();

/* ---- botó d'actualitzar: fa de F5 sense perdre el que tens a mig fer ----
   Les dades de les eines ja es desen soles al dispositiu. El que no es desa (els camps que tens
   escrits, p. ex. a «Temps de ruta») es guarda un moment i es retorna en recarregar. */
var RK='navalla-restore',UK='navalla-updated';
function gpxLoaded(){return document.querySelectorAll('#list .frag').length>0}
function snapshot(){
 var o={};
 Array.prototype.forEach.call(document.querySelectorAll('.toolsec:not(#t-gpx) input[id],.toolsec:not(#t-gpx) select[id]'),function(e){
  if(e.type==='file')return;o[e.id]=e.type==='checkbox'?e.checked:e.value});
 try{sessionStorage.setItem(RK,JSON.stringify({t:Date.now(),y:window.scrollY,v:o}))}catch(_){}
}
try{
 var r=JSON.parse(sessionStorage.getItem(RK)||'null');sessionStorage.removeItem(RK);
 if(r&&Date.now()-r.t<60000){
  Object.keys(r.v).forEach(function(id){
   var e=document.getElementById(id);if(!e||e.type==='file')return;
   if(e.type==='checkbox')e.checked=!!r.v[id];else e.value=r.v[id];
   e.dispatchEvent(new Event('input',{bubbles:true}));
   if(e.tagName==='SELECT')e.dispatchEvent(new Event('change',{bubbles:true}));
  });
  setTimeout(function(){window.scrollTo(0,r.y||0)},50);
 }
}catch(_){}
var home=document.getElementById('home');
if(home){
 var w=document.createElement('div');w.style.cssText='text-align:center;margin:26px 0 6px';
 w.innerHTML='<button class="sm" id="upd">Actualitza l’app</button><div class="mu" id="updm" style="margin-top:8px"></div>';
 home.appendChild(w);
 var um=document.getElementById('updm'),ub=document.getElementById('upd');
 (function(){
  var just=false;try{just=sessionStorage.getItem(UK)==='1';sessionStorage.removeItem(UK)}catch(_){}
  var base=just?'Actualitzada · ':'';
  if(window.caches)caches.keys().then(function(k){var v=k.filter(function(x){return /^navalla-v/.test(x)})[0];um.textContent=base+(v?'Versió '+v.replace('navalla-',''):'')}).catch(function(){um.textContent=base});
  else um.textContent=base;
 })();
 ub.onclick=async function(){
  if(gpxLoaded()&&!confirm('Tens una ruta carregada a l’editor de GPX i no es conserva en recarregar. Si continues, l’hauràs de tornar a carregar. Vols actualitzar igualment?'))return;
  ub.disabled=true;um.textContent='Buscant actualitzacions…';
  snapshot();
  try{sessionStorage.setItem(UK,'1')}catch(_){}
  try{
   if('serviceWorker' in navigator){var reg=await navigator.serviceWorker.getRegistration();if(reg)await reg.update()}
  }catch(_){}
  location.reload();
 };
}
})();
