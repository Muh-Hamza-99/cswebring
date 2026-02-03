(function () {
  const container = document.getElementById('webring');
  container.classList.add('loading');
  container.textContent = 'Loading…';

  fetch('/.netlify/functions/webring')
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load webring');
      return res.json();
    })
    .then(function (data) {
      if (data.status !== 'ok' || !Array.isArray(data.rows)) {
        throw new Error('Invalid response from server');
      }
      container.classList.remove('loading');
      container.textContent = '';
      render(data.rows);
    })
    .catch(function (err) {
      container.classList.remove('loading');
      container.classList.add('error');
      container.textContent = 'Could not load the webring. ' + err.message;
    });

  function render(students) {
    var byYear = {};
    students.forEach(function (s) {
      var y = s.year;
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(s);
    });

    var years = Object.keys(byYear).map(Number).sort(function (a, b) { return b - a; });

    years.forEach(function (year) {
      var section = document.createElement('section');
      section.className = 'year-section';

      var heading = document.createElement('h2');
      heading.className = 'year-heading';
      heading.textContent = year;
      section.appendChild(heading);

      byYear[year].forEach(function (student) {
        var entry = document.createElement('div');
        entry.className = 'entry';

        var link = document.createElement('a');
        link.href = student.website;
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
        link.textContent = student.name;

        var sep = document.createElement('span');
        sep.className = 'separator';
        sep.textContent = ' | ';

        var fact = document.createElement('span');
        fact.className = 'about';
        fact.textContent = ' ' + student.fact;

        entry.appendChild(link);
        entry.appendChild(sep);
        entry.appendChild(fact);
        section.appendChild(entry);
      });

      container.appendChild(section);
    });
  }
})();
