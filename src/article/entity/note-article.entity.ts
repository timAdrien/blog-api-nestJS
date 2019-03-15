import { UserNest } from "../../user/entity/user.entity";
import { Article } from "./article.entity";

export class NoteArticle{
    user: UserNest;
    article: Article;
    grade: number;
}