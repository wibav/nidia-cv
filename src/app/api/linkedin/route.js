import { NextResponse } from 'next/server';
import cheerio from 'cheerio';

export async function GET() {
    const profileUrl = 'https://www.linkedin.com/in/nidia-nahas/';
    const res = await fetch(profileUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);

    const name = $('h1').first().text().trim();
    const headline = $('div.text-body-medium').first().text().trim();

    const experiences = [];
    $('section#experience-section ul li').each((i, el) => {
        const title = $(el).find('h3').text().trim();
        const company = $(el).find('p.pv-entity__secondary-title').text().trim();
        experiences.push({ title, company });
    });

    return NextResponse.json({ name, headline, experiences });
}
