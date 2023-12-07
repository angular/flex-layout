// import ts from 'typescript';
// import {Rules, RuleWalker} from 'tslint';
// import {forEachComment} from 'tsutils';

// const ERROR_MESSAGE =
//     'A TODO may only appear in inline (//) style comments. ' +
//     'This is meant to prevent a TODO from being accidentally included in any public API docs.';

// /**
//  * Rule that walks through all comments inside of the library and adds failures when it
//  * detects TODO's inside of multi-line comments. TODOs need to be placed inside of single-line
//  * comments.
//  */
// export class Rule extends Rules.AbstractRule {

//   apply(sourceFile: ts.SourceFile) {
//     return this.applyWithWalker(new NoExposedTodoWalker(sourceFile, this.getOptions()));
//   }
// }

// class NoExposedTodoWalker extends RuleWalker {

//   visitSourceFile(sourceFile: ts.SourceFile) {
//     forEachComment(sourceFile, (text, commentRange) => {
//       const isTodoComment = text.substring(commentRange.pos, commentRange.end).includes('TODO:');

//       if (commentRange.kind === ts.SyntaxKind.MultiLineCommentTrivia && isTodoComment) {
//         this.addFailureAt(commentRange.pos, commentRange.end - commentRange.pos, ERROR_MESSAGE);
//       }
//     });

//     super.visitSourceFile(sourceFile);
//   }
// }
