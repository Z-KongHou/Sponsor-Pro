import { Context } from "koa";
import { Sponsor } from '../service/sponsorlist/sponsor';

export async function SponsorList(ctx: Context) {
    const { search, category, page, location } = ctx.request.query;
    const currentPage = parseInt(page as string) || 1;
    try {
        const res = await Sponsor(ctx,{
            search: search as string,
            category: category as string,
            location: location as string,
            page: currentPage,
        });
        ctx.body = {
            code: 200,
            message: 'success',
            data: res,
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: 'error',
            data: null,
        }
    }
}