# CS Webring

A webring for University of Waterloo CS students. Add your site and a short line about yourself.

**Maintainers:** To ensure only you can merge PRs, edit [.github/CODEOWNERS](.github/CODEOWNERS) (put your GitHub username) and follow [.github/MAINTAINER_SETUP.md](.github/MAINTAINER_SETUP.md).

## Adding your row

1. **Fork this repo** and open a pull request.

2. **Edit `students.json`** and add exactly **one** new entry for yourself. Use this shape:

   ```json
   {
     "name": "Your Name",
     "website": "https://your-site.com",
     "year": 2028,
     "about": "A short line about you (max 50 characters)"
   }
   ```

3. **Place your entry** in the existing array. Keep the list as valid JSON (commas between objects, no trailing comma after the last one).

4. **Open a PR** with only your one new row. The CI will check that:
   - You added at most one new entry.
   - `name`, `website`, `year`, `about` are present.
   - `website` is a valid http/https URL.
   - `year` is an integer between 2000 and 2100.
   - `about` has length ≤ 50 characters.

### Example

```json
{
  "name": "Jane Doe",
  "website": "https://jane.dev",
  "year": 2027,
  "about": "Into systems and open source"
}
```
